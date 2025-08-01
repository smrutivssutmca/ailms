"""add normalized question models

Revision ID: c5c8d8650c00
Revises: 7265e8b7d29b
Create Date: 2025-07-26 15:18:29.364556

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c5c8d8650c00'
down_revision: Union[str, Sequence[str], None] = '7265e8b7d29b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user_question_attended', sa.Column('score', sa.Float(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user_question_attended', 'score')
    # ### end Alembic commands ###
