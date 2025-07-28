import math
import numpy as np

D = 1.702  # scaling constant for IRT (common value for 3PL)


# ---------- IRT helper functions -------------------------------------------
def p_3pl(theta, a, b, c):
    """Return 3PL probability of a correct response for ability theta."""
    return c + (1 - c) / (1 + math.exp(-D * a * (theta - b)))


def info_3pl(theta, a, b, c):
    """Return Fisher information of an item at ability theta (3PL)."""
    P = p_3pl(theta, a, b, c)
    return (D * a) ** 2 * ((P - c) ** 2) / (P * (1 - P) + 1e-9)


def update_theta(theta, a, b, c, correct, lr=0.1):
    """
    One-step gradient ascent update for theta.
    correct: 1 if response correct, 0 otherwise.
    lr: learning rate (step size).
    """
    P = p_3pl(theta, a, b, c)
    grad = D * a * (correct - P) * (1 - P) / (P - c + 1e-9)
    return theta + lr * grad


# ---------- Item selection policy ------------------------------------------
def pick_item(theta, pool, step_idx):
    """
    Select next item.
    - Step 0: choose item whose difficulty is closest to the median difficulty
              (acts like a "mid-level" starting point).
    - Later:  choose the item with the highest Fisher information,
              preferring items with difficulty >= current theta.
    """
    if step_idx == 0:
        bs = np.array([q["difficulty"] for q in pool])
        median_b = np.median(bs)
        return min(pool, key=lambda q: abs(q["difficulty"] - median_b))

    # Prefer items not easier than current theta
    above = [q for q in pool if q["difficulty"] >= theta]
    candidates = above if above else pool  # fallback if nothing above

    # Pick the most informative candidate at current theta
    return max(
        candidates,
        key=lambda q: info_3pl(
            theta, q["discrimination"], q["difficulty"], q["guessing"]
        ),
    )
