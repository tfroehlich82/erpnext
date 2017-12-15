# Copyright (c) 2017, Frappe and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
from erpnext.setup.doctype.company.company import install_country_fixtures

def execute():
	for d in frappe.get_all('Company',
		filters={'country': ('in', ['Saudi Arabia', 'United Arab Emirates'])}):
		install_country_fixtures(d.name)