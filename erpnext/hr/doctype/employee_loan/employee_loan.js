// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Employee Loan', {
	onload: function(frm) {
		frm.set_query("employee_loan_application", function() {
			return {
				"filters": {
					"employee": frm.doc.employee,
					"docstatus": 1,
					"status": "Approved"
				}
			};
		});

		$.each(["payment_account", "employee_loan_account"], function(i, field) {
			frm.set_query(field, function() {
				return {
					"filters": {
						"company": frm.doc.company,
						"root_type": "Asset",
						"is_group": 0
					}
				};
			});
		})
	},

	mode_of_payment: function(frm){
		frappe.call({
			method: "erpnext.accounts.doctype.sales_invoice.sales_invoice.get_bank_cash_account",
			args: {
				"mode_of_payment": frm.doc.mode_of_payment,
				"company": frm.doc.company
			},
			callback: function(r, rt) {
				if(r.message) {
					frm.set_value("payment_account", r.message.account);
				}
			}
		});
	},

	refresh: function(frm) {
		frm.trigger("toggle_fields");

		if(frm.doc.docstatus==1) {
			frm.add_custom_button(__('Ledger'), function() {
				frappe.route_options = {
					"voucher_no": frm.doc.name,
					"from_date": frm.doc.posting_date,
					"to_date": frm.doc.posting_date,
					"company": frm.doc.company,
					group_by_voucher: 0
				};
				frappe.set_route("query-report", "General Ledger");
			}, "fa fa-table");
		}
	},

	employee_loan_application: function(frm) {
		return frm.call({
			method: "erpnext.hr.doctype.employee_loan.employee_loan.get_employee_loan_application",
			args: {
				"employee_loan_application": frm.doc.employee_loan_application
			},
			callback: function(r){
				if(!r.exc && r.message) {
					frm.set_value("loan_type", r.message.loan_type);
					frm.set_value("loan_amount", r.message.loan_amount);
					frm.set_value("repayment_method", r.message.repayment_method);
					frm.set_value("monthly_repayment_amount", r.message.repayment_amount);
					frm.set_value("repayment_periods", r.message.repayment_periods);
					frm.set_value("rate_of_interest", r.message.rate_of_interest);
				}
			}
		})
	},

	repayment_method: function(frm) {
		frm.trigger("toggle_fields")
	},

	toggle_fields: function(frm) {
		frm.toggle_enable("monthly_repayment_amount", frm.doc.repayment_method=="Repay Fixed Amount per Period")
		frm.toggle_enable("repayment_periods", frm.doc.repayment_method=="Repay Over Number of Periods")
	}
});
