
"""
Aro Mini v0.1 — PyTorch inference engine
Architecture-compatible implementation for the saved checkpoint.

Checkpoint:
    aro_mini_v0_1.pt

Python: 3.13+
PyTorch: 2.x
"""

from pathlib import Path

import torch
import torch.nn as nn
import torch.nn.functional as F


# --------------------------------------------------
# Configuration
# --------------------------------------------------

MODEL_DIR = Path(__file__).resolve().parent
CHECKPOINT_PATH = MODEL_DIR / "aro_mini_v0_1.pt"

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# --------------------------------------------------
# Self-attention head
# --------------------------------------------------

class Head(nn.Module):
    def __init__(self, n_embd, n_head, block_size):
        super().__init__()

        head_size = n_embd // n_head

        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)

        self.head_size = head_size
        self.block_size = block_size

    def forward(self, x):
        batch_size, seq_len, channels = x.shape

        k = self.key(x)
        q = self.query(x)
        v = self.value(x)

        # Scaled dot-product attention
        weights = q @ k.transpose(-2, -1)
        weights = weights * (self.head_size ** -0.5)

        # Causal mask: never attend to future characters.
        mask = torch.tril(
            torch.ones(
                seq_len,
                seq_len,
                device=x.device,
                dtype=torch.bool,
            )
        )

        weights = weights.masked_fill(~mask, float("-inf"))
        weights = F.softmax(weights, dim=-1)

        return weights @ v


# --------------------------------------------------
# Multi-head attention
# --------------------------------------------------

class MultiHeadAttention(nn.Module):
    def __init__(self, n_embd, n_head, block_size):
        super().__init__()

        self.heads = nn.ModuleList([
            Head(n_embd, n_head, block_size)
            for _ in range(n_head)
        ])

        self.proj = nn.Linear(n_embd, n_embd)

    def forward(self, x):
        x = torch.cat(
            [head(x) for head in self.heads],
            dim=-1,
        )

        return self.proj(x)


# --------------------------------------------------
# Feed-forward network
# --------------------------------------------------

class FeedForward(nn.Module):
    def __init__(self, n_embd):
        super().__init__()

        self.net = nn.Sequential(
            nn.Linear(n_embd, 4 * n_embd),
            nn.ReLU(),
            nn.Linear(4 * n_embd, n_embd),
        )

    def forward(self, x):
        return self.net(x)


# --------------------------------------------------
# Transformer block — pre-layer normalization
# --------------------------------------------------

class Block(nn.Module):
    def __init__(self, n_embd, n_head, block_size):
        super().__init__()

        self.attn = MultiHeadAttention(
            n_embd, n_head, block_size
        )
        self.ffwd = FeedForward(n_embd)

        self.ln1 = nn.LayerNorm(n_embd)
        self.ln2 = nn.LayerNorm(n_embd)

    def forward(self, x):
        x = x + self.attn(self.ln1(x))
        x = x + self.ffwd(self.ln2(x))

        return x


# --------------------------------------------------
# Aro Mini language model
# --------------------------------------------------

class AroMini(nn.Module):
    def __init__(
        self,
        vocab_size,
        n_embd=64,
        n_head=4,
        n_layer=2,
        block_size=64,
    ):
        super().__init__()

        self.block_size = block_size

        self.token_embedding = nn.Embedding(
            vocab_size, n_embd
        )

        self.position_embedding = nn.Embedding(
            block_size, n_embd
        )

        self.blocks = nn.Sequential(*[
            Block(n_embd, n_head, block_size)
            for _ in range(n_layer)
        ])

        self.final_ln = nn.LayerNorm(n_embd)
        self.lm_head = nn.Linear(n_embd, vocab_size)

    def forward(self, idx, targets=None):
        batch_size, seq_len = idx.shape

        if seq_len > self.block_size:
            raise ValueError(
                f"Input length {seq_len} exceeds "
                f"context window {self.block_size}."
            )

        token_embeddings = self.token_embedding(idx)

        positions = torch.arange(
            seq_len, device=idx.device
        )

        position_embeddings = self.position_embedding(
            positions
        )

        x = token_embeddings + position_embeddings
        x = self.blocks(x)
        x = self.final_ln(x)

        logits = self.lm_head(x)
        loss = None

        if targets is not None:
            batch_size, seq_len, vocab_size = logits.shape

            loss = F.cross_entropy(
                logits.reshape(batch_size * seq_len, vocab_size),
                targets.reshape(batch_size * seq_len),
            )

        return logits, loss

    @torch.no_grad()
    def generate(
        self,
        idx,
        max_new_tokens=200,
        temperature=0.8,
        top_k=None,
    ):
        if temperature <= 0:
            raise ValueError("temperature must be greater than zero")

        for _ in range(max_new_tokens):
            # Keep only the most recent context characters.
            idx_cond = idx[:, -self.block_size:]

            logits, _ = self(idx_cond)

            # Predict the next character.
            logits = logits[:, -1, :] / temperature

            if top_k is not None:
                k = min(top_k, logits.size(-1))
                threshold = torch.topk(logits, k, dim=-1).values[:, -1:]
                logits = logits.masked_fill(
                    logits < threshold, float("-inf")
                )

            probabilities = F.softmax(logits, dim=-1)

            next_token = torch.multinomial(
                probabilities, num_samples=1
            )

            idx = torch.cat((idx, next_token), dim=1)

        return idx


# --------------------------------------------------
# Checkpoint loading and text generation
# --------------------------------------------------

def load_model(checkpoint_path=CHECKPOINT_PATH):
    """
    Load the trained Aro Mini checkpoint.

    Expected checkpoint keys:
        model_state_dict
        chars
        config
    """

    checkpoint_path = Path(checkpoint_path)

    if not checkpoint_path.exists():
        raise FileNotFoundError(
            f"Checkpoint not found: {checkpoint_path}\n"
            "Place aro_mini_v0_1.pt beside model.py."
        )

    checkpoint = torch.load(
        checkpoint_path,
        map_location=DEVICE,
        weights_only=True,
    )

    chars = checkpoint["chars"]
    config = checkpoint["config"]

    stoi = {char: i for i, char in enumerate(chars)}
    itos = {i: char for i, char in enumerate(chars)}

    model = AroMini(
        vocab_size=len(chars),
        n_embd=config.get("n_embd", 64),
        n_head=config.get("n_head", 4),
        n_layer=config.get("n_layer", 2),
        block_size=config.get("block_size", 64),
    )

    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(DEVICE)
    model.eval()

    return model, stoi, itos


def generate_text(
    model,
    stoi,
    itos,
    prompt="",
    max_new_tokens=200,
    temperature=0.8,
    top_k=None,
):
    """
    Generate text using Aro Mini's character vocabulary.

    Unknown prompt characters are skipped.
    """

    encoded = [
        stoi[char] for char in prompt if char in stoi
    ]

    if not encoded:
        encoded = [0]

    input_ids = torch.tensor(
        [encoded], dtype=torch.long, device=DEVICE
    )

    output_ids = model.generate(
        input_ids,
        max_new_tokens=max_new_tokens,
        temperature=temperature,
        top_k=top_k,
    )

    return "".join(
        itos[int(token)] for token in output_ids[0]
    )


if __name__ == "__main__":
    print("Loading Aro Mini v0.1...")

    model, stoi, itos = load_model()

    print(f"Model loaded on: {DEVICE}")
    print(f"Vocabulary size: {len(stoi)}")
    print("Type 'exit' to quit.\n")

    while True:
        prompt = input("You > ")

        if prompt.strip().lower() == "exit":
            break

        result = generate_text(
            model,
            stoi,
            itos,
            prompt=prompt,
            max_new_tokens=200,
            temperature=0.8,
            top_k=20,
        )

        print(f"Aro Mini > {result}\n")
