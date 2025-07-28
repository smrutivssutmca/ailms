"""Creating new tables for question

Revision ID: 01f378ed550d
Revises: e91e21d74cd7
Create Date: 2025-07-26 00:10:38.363837

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '01f378ed550d'
down_revision: Union[str, Sequence[str], None] = 'e91e21d74cd7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
