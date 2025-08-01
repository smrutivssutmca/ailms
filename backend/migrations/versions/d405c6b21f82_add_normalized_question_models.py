"""add normalized question models

Revision ID: d405c6b21f82
Revises: 0aeb2e75f235
Create Date: 2025-07-26 10:38:12.943301

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd405c6b21f82'
down_revision: Union[str, Sequence[str], None] = '0aeb2e75f235'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_results',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('grade_id', sa.Integer(), nullable=False),
    sa.Column('subject_id', sa.Integer(), nullable=False),
    sa.Column('score', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['grade_id'], ['grades.id'], ),
    sa.ForeignKeyConstraint(['subject_id'], ['subjects.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_results_id'), 'user_results', ['id'], unique=False)
    op.add_column('updated_questions', sa.Column('discrimintion_value', sa.Float(), nullable=True))
    op.add_column('updated_questions', sa.Column('guessing_value', sa.Float(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('updated_questions', 'guessing_value')
    op.drop_column('updated_questions', 'discrimintion_value')
    op.drop_index(op.f('ix_user_results_id'), table_name='user_results')
    op.drop_table('user_results')
    # ### end Alembic commands ###
