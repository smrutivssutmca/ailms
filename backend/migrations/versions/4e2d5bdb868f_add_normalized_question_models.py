"""add normalized question models

Revision ID: 4e2d5bdb868f
Revises: 1314238654e2
Create Date: 2025-07-26 06:55:18.046622

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4e2d5bdb868f'
down_revision: Union[str, Sequence[str], None] = '1314238654e2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_topics_name'), table_name='topics')
    op.create_index(op.f('ix_topics_name'), 'topics', ['name'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_topics_name'), table_name='topics')
    op.create_index(op.f('ix_topics_name'), 'topics', ['name'], unique=True)
    # ### end Alembic commands ###
