from odoo import api, fields, models
from odoo.fields import Command


class PosOrder(models.Model):
    _inherit = 'pos.order'

    tag_ids = fields.Many2many(
        'digizilla.order.tags',
        string='Order Tags'
    )

    @api.model
    def _process_order(self, order, existing_order):
        tag_ids = order.pop('tag_ids', [])
        result_id = super()._process_order(order, existing_order)
        if tag_ids:
            self.env['pos.order'].browse(result_id).write(
                {'tag_ids': [Command.set(tag_ids)]}
            )
        return result_id
