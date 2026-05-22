from odoo import api, models


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _load_pos_data_models(self, config):
        data = super()._load_pos_data_models(config)
        data += ['digizilla.order.tags']
        return data
