"""Initial schema — all tables

Revision ID: 001
Revises:
Create Date: 2026-02-26 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, ARRAY

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # users
    op.create_table(
        "users",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("email", sa.String(), unique=True, nullable=False),
        sa.Column("full_name", sa.String()),
        sa.Column("avatar_url", sa.String()),
        sa.Column("gmail_access_token", sa.String()),
        sa.Column("gmail_refresh_token", sa.String()),
        sa.Column("gmail_token_expiry", sa.DateTime(timezone=True)),
        sa.Column("apollo_api_key", sa.String()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # companies
    op.create_table(
        "companies",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("domain", sa.String()),
        sa.Column("industry", sa.String()),
        sa.Column("size_range", sa.String()),
        sa.Column("headquarters", sa.String()),
        sa.Column("website", sa.String()),
        sa.Column("linkedin_url", sa.String()),
        sa.Column("apollo_id", sa.String(), unique=True),
        sa.Column("description", sa.Text()),
        sa.Column("tags", ARRAY(sa.String())),
        sa.Column("created_by", UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_companies_name", "companies", ["name"])
    op.create_index("ix_companies_apollo_id", "companies", ["apollo_id"])

    # contacts
    op.create_table(
        "contacts",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("first_name", sa.String(), nullable=False),
        sa.Column("last_name", sa.String(), nullable=False),
        sa.Column("email", sa.String()),
        sa.Column("phone", sa.String()),
        sa.Column("title", sa.String()),
        sa.Column("linkedin_url", sa.String()),
        sa.Column("company_id", UUID(as_uuid=True), sa.ForeignKey("companies.id")),
        sa.Column("apollo_id", sa.String(), unique=True),
        sa.Column("source", sa.String(), server_default="manual"),
        sa.Column("notes", sa.Text()),
        sa.Column("tags", ARRAY(sa.String())),
        sa.Column("created_by", UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_contacts_email", "contacts", ["email"])
    op.create_index("ix_contacts_apollo_id", "contacts", ["apollo_id"])
    op.create_index("ix_contacts_company_id", "contacts", ["company_id"])

    # outreach_records
    op.create_table(
        "outreach_records",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("contact_id", UUID(as_uuid=True), sa.ForeignKey("contacts.id")),
        sa.Column("company_id", UUID(as_uuid=True), sa.ForeignKey("companies.id")),
        sa.Column("status", sa.String(), server_default="not_contacted"),
        sa.Column("channel", sa.String()),
        sa.Column("priority", sa.String(), server_default="medium"),
        sa.Column("assigned_to", UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("next_follow_up", sa.DateTime(timezone=True)),
        sa.Column("notes", sa.Text()),
        sa.Column("created_by", UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_outreach_contact_id", "outreach_records", ["contact_id"])
    op.create_index("ix_outreach_status", "outreach_records", ["status"])

    # email_templates
    op.create_table(
        "email_templates",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("subject", sa.String(), nullable=False),
        sa.Column("body_html", sa.Text(), nullable=False),
        sa.Column("body_text", sa.Text()),
        sa.Column("variables", ARRAY(sa.String())),
        sa.Column("created_by", UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # email_logs
    op.create_table(
        "email_logs",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("contact_id", UUID(as_uuid=True), sa.ForeignKey("contacts.id")),
        sa.Column("outreach_id", UUID(as_uuid=True), sa.ForeignKey("outreach_records.id")),
        sa.Column("template_id", UUID(as_uuid=True), sa.ForeignKey("email_templates.id")),
        sa.Column("from_address", sa.String(), nullable=False),
        sa.Column("to_address", sa.String(), nullable=False),
        sa.Column("subject", sa.String(), nullable=False),
        sa.Column("body_html", sa.Text()),
        sa.Column("status", sa.String(), server_default="draft"),
        sa.Column("scheduled_for", sa.DateTime(timezone=True)),
        sa.Column("sent_at", sa.DateTime(timezone=True)),
        sa.Column("gmail_message_id", sa.String()),
        sa.Column("error_message", sa.Text()),
        sa.Column("created_by", UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_email_logs_status", "email_logs", ["status"])
    op.create_index("ix_email_logs_contact_id", "email_logs", ["contact_id"])

    # activity_log
    op.create_table(
        "activity_log",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("entity_type", sa.String()),
        sa.Column("entity_id", UUID(as_uuid=True)),
        sa.Column("action", sa.String()),
        sa.Column("metadata", sa.JSON()),
        sa.Column("performed_by", UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_activity_entity", "activity_log", ["entity_type", "entity_id"])


def downgrade() -> None:
    op.drop_table("activity_log")
    op.drop_table("email_logs")
    op.drop_table("email_templates")
    op.drop_table("outreach_records")
    op.drop_table("contacts")
    op.drop_table("companies")
    op.drop_table("users")
