"""Creating new tables for question

Revision ID: c5b21794efae
Revises: 01f378ed550d
Create Date: 2025-07-26 00:12:36.643948

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c5b21794efae'
down_revision: Union[str, Sequence[str], None] = '01f378ed550d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
