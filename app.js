const filmData = [
	{ id: 1, title: "The Shawshank Redemption", year: 1994, votes: 678790, rating: 9.2, rank: 1, category: "Thriller" },
	{ id: 2, title: "The Godfather", year: 1972, votes: 511495, rating: 9.2, rank: 2, category: "Crime" },
	{ id: 3, title: "The Godfather: Part II", year: 1974, votes: 319352, rating: 9.0, rank: 3, category: "Crime" },
	{ id: 4, title: "The Good, the Bad and the Ugly", year: 1966, votes: 213030, rating: 8.9, rank: 4, category: "Western" },
	{ id: 5, title: "Pulp fiction", year: 1994, votes: 533848, rating: 8.9, rank: 5, category: "Crime" },
	{ id: 6, title: "12 Angry Men", year: 1957, votes: 164558, rating: 8.9, rank: 6, category: "Western" }
]

webix.protoUI({
	name: "changeStateBtn",
	$cssName: "button",
	$init: function (config) {
		const state = config.value || 0
		config.value = config.states[state]
		webix.html.addCss(this.$view, "webix_state_" + state)

		this.attachEvent("onItemClick", () => {
			let state = this.config.state
			webix.html.removeCss(this.$view, "webix_state_" + (state))

			state++
			if (state > 2) state = 0
			this.config.state = state
			this.config.label = this.config.states[state]
			this.refresh();

			webix.html.addCss(this.$view, "webix_state_" + (state))
			this.callEvent("onStateChange", [state])
		})
	}
}, webix.ui.button)

webix.protoUI({
	name: "commonForm",
	defaults: {
		fields: [],
		cancelBtn: function () {
			const self = this
			self.clear()
			webix.message('Cleared!')
		},
		saveBtn: function () {
			const self = this
			const values = self.getValues()
			webix.message(JSON.stringify(values), 'info', 1700)
		}
	},
	$init(config) {
		let createNewField
		let value = config.fields

		if (!webix.isArray(value))
			value = [value];

		if (value.length !== 0 && value[0] !== '') {
			createNewField = value.map(v => ({ view: "text", label: v, name: v }))
		} else {
			webix.message({ type: "error", text: "The field value is empty!" });
		}


		config.rows = [
			{
				localId: 'formElements',
				rows: [...createNewField || '']
			},
			{
				cols: [
					{

						view: "button",
						width: 150,
						value: 'Cancel',
						click: () => {
							config.cancelBtn ? config.cancelBtn.call(this) : this.defaults.cancelBtn.call(this)
						}
					},
					{},
					{
						view: "button",
						width: 150,
						value: 'Save',
						css: "webix_primary",
						click: () => {
							config.saveBtn ? config.saveBtn.call(this) : this.defaults.saveBtn.call(this)
						},
					}
				]
			}
		]
	},


}, webix.ui.form)


webix.ui({
	cols: [{
		rows: [{
			view: "toolbar",
			elements: [{
				view: "changeStateBtn",
				width: 100,
				state: 0,
				states: {
					0: "Off",
					1: "Sort Asc",
					2: "Sort Desc"
				},
				on: {
					onStateChange: function (state) {
						const data = $$("dt")
						if (state === 0)
							data.sort("id", "asc")
						else if (state === 1)
							data.sort("title", "asc")
						else
							data.sort("title", "desc")
					}
				}
			}]
		},
		{
			view: "datatable",
			autoConfig: true,
			id: "dt",
			scroll: false,
			data: filmData,
			gravity: 1

		}]
	},

	{
		view: "commonForm",
		id: "myForm",
		width: 600,
		fields: ['Fname', 'Lname'],
		saveBtn: () => alert('Default function was replaced with another function!')
	}]
});