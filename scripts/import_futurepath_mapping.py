#!/usr/bin/env python3
"""
Import FuturePath consolidated course mapping into the database.
Parses CSV and generates SQL INSERT statements for programme/stream eligibility mappings.
"""

import csv
import sys
from pathlib import Path

def parse_csv_and_generate_sql(csv_file: str, output_file: str = None):
    """Parse futurepath CSV and generate SQL insert statements."""

    csv_path = Path(csv_file)
    if not csv_path.exists():
        print(f"Error: File not found: {csv_file}", file=sys.stderr)
        return False

    # Track unique values
    degree_families = set()
    stream_groups = set()
    programmes = {}  # {name: family_id_placeholder}
    mappings = []

    # Read CSV
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            mapping_id = row.get('mapping_id', '').strip()
            degree_family = row.get('degree_family', '').strip()
            programme_name = row.get('programme_name', '').strip()
            stream_group = row.get('stream_group', '').strip()
            eligibility_status = row.get('eligibility_status', '').strip()

            if not all([mapping_id, degree_family, programme_name, stream_group, eligibility_status]):
                print(f"Warning: Skipping incomplete row: {mapping_id}", file=sys.stderr)
                continue

            degree_families.add(degree_family)
            stream_groups.add(stream_group)

            programme_key = f"{programme_name}||{degree_family}"
            programmes[programme_key] = degree_family

            mappings.append({
                'mapping_id': mapping_id,
                'degree_family': degree_family,
                'programme_name': programme_name,
                'stream_group': stream_group,
                'eligibility_status': eligibility_status
            })

    # Generate SQL
    sql_lines = [
        "-- Import FuturePath Career Programme Mappings",
        "-- This file is auto-generated from futurepath_consolidated_course_mapping.csv",
        ""
    ]

    # Insert degree families
    sql_lines.append("-- Insert Degree Families")
    for family in sorted(degree_families):
        sql_lines.append(f"INSERT INTO degree_families (name, description) VALUES ('{escape_sql(family)}', NULL) ON CONFLICT (name) DO NOTHING;")

    sql_lines.append("")

    # Insert programmes
    sql_lines.append("-- Insert Programmes")
    for prog_key in sorted(programmes.keys()):
        prog_name, degree_family = prog_key.split('||')
        sql_lines.append(
            f"INSERT INTO programmes (name, degree_family_id) SELECT '{escape_sql(prog_name)}', id FROM degree_families WHERE name = '{escape_sql(degree_family)}' "
            f"ON CONFLICT (name) DO NOTHING;"
        )

    sql_lines.append("")

    # Insert mappings
    sql_lines.append("-- Insert Programme Stream Eligibility Mappings")
    sql_lines.append("-- Status: GREEN (Ideal fit), YELLOW (Good fit), RED (Not recommended)")
    sql_lines.append("-- Combined statuses: GREEN_YELLOW, RED_YELLOW")
    for mapping in mappings:
        sql_lines.append(
            f"INSERT INTO programme_stream_eligibility (mapping_id, programme_id, stream_group_id, eligibility_status) "
            f"SELECT '{mapping['mapping_id']}', p.id, s.id, '{mapping['eligibility_status']}' "
            f"FROM programmes p, stream_groups s "
            f"WHERE p.name = '{escape_sql(mapping['programme_name'])}' "
            f"AND s.code = '{escape_sql(mapping['stream_group'])}' "
            f"ON CONFLICT (mapping_id) DO NOTHING;"
        )

    sql_content = "\n".join(sql_lines)

    # Write output
    if output_file:
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(sql_content)
        print(f"Generated SQL file: {output_file}")
    else:
        print(sql_content)

    print(f"\nSummary:", file=sys.stderr)
    print(f"  Degree Families: {len(degree_families)}", file=sys.stderr)
    print(f"  Programmes: {len(programmes)}", file=sys.stderr)
    print(f"  Stream Groups: {len(stream_groups)}", file=sys.stderr)
    print(f"  Mappings: {len(mappings)}", file=sys.stderr)

    return True

def escape_sql(text: str) -> str:
    """Escape single quotes in SQL strings."""
    return text.replace("'", "''")

if __name__ == '__main__':
    csv_file = 'futurepath_consolidated_course_mapping.csv'
    output_file = 'insert_programme_mappings.sql'

    if len(sys.argv) > 1:
        csv_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]

    success = parse_csv_and_generate_sql(csv_file, output_file)
    sys.exit(0 if success else 1)
