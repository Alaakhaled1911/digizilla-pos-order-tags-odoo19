/** @odoo-module **/

import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { patch } from "@web/core/utils/patch";

patch(PosOrder.prototype, {
  setup(vals) {
    super.setup(...arguments);
    // uiState doesn't exist yet during creation (initState runs after setup in Odoo 19).
    // Cache the value for initState; for updates uiState already exists so set directly.
    this._pendingTagIds = vals.tag_ids || [];
    if (this.uiState) {
      this.uiState.digizilla_tag_ids = this._pendingTagIds;
    }
  },

  initState() {
    super.initState(...arguments);
    this.uiState.digizilla_tag_ids = this._pendingTagIds || [];
  },

  serializeForORM(opts = {}) {
    const result = super.serializeForORM(...arguments);
    result.tag_ids = this.uiState.digizilla_tag_ids || [];
    return result;
  },

  get hasOrderTags() {
    return this.uiState.digizilla_tag_ids?.length > 0;
  },

  getOrderTagObjects() {
    const allTags = this.models["digizilla.order.tags"].getAll();
    return allTags.filter((tag) =>
      this.uiState.digizilla_tag_ids.includes(tag.id),
    );
  },

  setOrderTags(tagIds) {
    this.uiState.digizilla_tag_ids = tagIds;
  },
});
