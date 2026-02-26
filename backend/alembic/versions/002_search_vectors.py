"""Add tsvector columns and GIN indexes for full-text search

Revision ID: 002
Revises: 001
Create Date: 2026-02-26 00:00:01.000000
"""
from alembic import op
import sqlalchemy as sa

revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add search_vector columns
    op.add_column("contacts", sa.Column("search_vector", sa.Text()))
    op.add_column("companies", sa.Column("search_vector", sa.Text()))

    # GIN indexes for full-text search
    op.execute("""
        CREATE INDEX ix_contacts_search ON contacts
        USING GIN (to_tsvector('english', coalesce(first_name,'') || ' ' ||
                   coalesce(last_name,'') || ' ' || coalesce(email,'') || ' ' ||
                   coalesce(title,'')))
    """)
    op.execute("""
        CREATE INDEX ix_companies_search ON companies
        USING GIN (to_tsvector('english', coalesce(name,'') || ' ' ||
                   coalesce(domain,'') || ' ' || coalesce(industry,'')))
    """)

    # Triggers to keep search_vector current
    op.execute("""
        CREATE OR REPLACE FUNCTION contacts_search_vector_update() RETURNS trigger AS $$
        BEGIN
            NEW.search_vector := to_tsvector('english',
                coalesce(NEW.first_name,'') || ' ' ||
                coalesce(NEW.last_name,'') || ' ' ||
                coalesce(NEW.email,'') || ' ' ||
                coalesce(NEW.title,''));
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)
    op.execute("""
        CREATE TRIGGER contacts_search_vector_trigger
        BEFORE INSERT OR UPDATE ON contacts
        FOR EACH ROW EXECUTE FUNCTION contacts_search_vector_update();
    """)
    op.execute("""
        CREATE OR REPLACE FUNCTION companies_search_vector_update() RETURNS trigger AS $$
        BEGIN
            NEW.search_vector := to_tsvector('english',
                coalesce(NEW.name,'') || ' ' ||
                coalesce(NEW.domain,'') || ' ' ||
                coalesce(NEW.industry,''));
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)
    op.execute("""
        CREATE TRIGGER companies_search_vector_trigger
        BEFORE INSERT OR UPDATE ON companies
        FOR EACH ROW EXECUTE FUNCTION companies_search_vector_update();
    """)


def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS contacts_search_vector_trigger ON contacts")
    op.execute("DROP TRIGGER IF EXISTS companies_search_vector_trigger ON companies")
    op.execute("DROP FUNCTION IF EXISTS contacts_search_vector_update()")
    op.execute("DROP FUNCTION IF EXISTS companies_search_vector_update()")
    op.execute("DROP INDEX IF EXISTS ix_contacts_search")
    op.execute("DROP INDEX IF EXISTS ix_companies_search")
    op.drop_column("contacts", "search_vector")
    op.drop_column("companies", "search_vector")
