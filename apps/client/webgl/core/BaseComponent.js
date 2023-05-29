import { generateUUID } from '@lm/utils/string';
import { getWebgl } from '~webgl/core';
/// #if DEBUG
import { createLogger } from '@lm/utils/debug';
/// #endif

let uid = 0;

/**
 * @description Base class for all webgl's components
 * @description All methods have a 'before' and 'after' method associated
 *
 * @function init - Called on init
 * @function update - Called on update
 * @function render - Called on render
 * @function destroy - Called on destroy
 * @function debug - Called on debug - ONLY IN DEBUG MODE
 */
export default class BaseComponent {
	constructor(props = {}) {
		this.props = props;
		this.isComponent = true;
		this.isInitialized = false;
		this.isDestroyed = false;
		this.children = new Map();
		this.webgl = getWebgl();

		this.parent = props.parent ?? null;

		// TODO: un peu complexe, à revoir
		this.uid = uid++;
		let i = 0;
		let name = (props.name || props.id || this.constructor.name || `Component#${ uid }`) + '#' + i;
		// if a component with the same name already exists, add a number to the end
		while (this.webgl.components[ name ]) name = this.name + '#' + i++;
		this.name = name;
		this.webgl.components[ this.name ] = this;

		this.uuid = generateUUID(uid);

		const { log, warn, error } = createLogger('GL·' + this.name, '#000', '#FED9B7');
		Object.assign(this, { log, warn, error });
	}

	triggerInit() {
		if (this.beforeInit) this.beforeInit();
		if (this.init) this.init();

		/// #if DEBUG
		if (this.debug) this.beforeDebug();
		/// #endif

		if (this.afterInit) this.afterInit();

		// Link the methods only on the parent component
		// Leave it here so we can instentiate a component without a parent
		if (!this.parent) {
			this.webgl.hooks.beforeUpdate.watch(this.triggerUpdate, this);
			this.webgl.hooks.beforeRender.watch(this.triggerRender, this);
		}

		this.isInitialized = true;
	}

	triggerUpdate() {
		if (this.beforeUpdate) this.beforeUpdate();

		if (this.children.size)
			this.children.forEach((child) => child.isInitialized && child.triggerUpdate());

		if (this.update) this.update();
		if (this.afterUpdate) this.afterUpdate();
	}

	triggerRender() {
		if (this.beforeRender) this.beforeRender();

		if (this.children.size)
			this.children.forEach((child) => child.isInitialized && child.triggerRender());

		if (this.render) this.render();
		if (this.afterRender) this.afterRender();
	}

	triggerDestroy() {
		this.webgl.hooks.beforeUpdate.unwatch(this.triggerUpdate, this);
		this.webgl.hooks.beforeRender.unwatch(this.triggerRender, this);

		if (this.children.size)
			this.children.forEach((child) => {
				!child.isDestroyed && child.triggerDestroy();
				this.remove(child);
			});

		if (this.beforeDestroy) this.beforeDestroy();
		if (this.destroy) this.destroy();
		if (this.afterDestroy) this.afterDestroy();

		this.gui && this.gui.dispose();

		delete this.webgl.components[ this.name ];
		this.isDestroyed = true;
	}

	/// #if DEBUG
	beforeDebug() {
		let gui = this.gui = this.webgl.$gui.addFolder({ title: this.name });

		this.debug();

		if (gui != this.gui) gui.dispose();

		this.afterDebug && this.afterDebug();
	}
	/// #endif

	/**
	 * @typedef BaseComponent
	 */
	add(Component, props = {}) {
		let c = Component;
		if (!c.isComponent) c = new c({ ...props, parent: this });
		else if (!c.parent) {
			c.parent = this;
			// In case the component was instanciated without a parent
			this.webgl.hooks.beforeUpdate.unwatch(c.triggerUpdate, c);
			this.webgl.hooks.beforeRender.unwatch(c.triggerRender, c);
		} else return this.error('Component already has a parent');

		!c.isInitialized && c.triggerInit();
		c.base && c.base.setParent(this.instance); // TODO: remove this
		this.children.set(c.name, c);
		return c;
	}

	/**
	 * @typedef BaseComponent
	 */
	remove(Component) {
		if (Component.isComponent && Component.parent === this)
			this.children.delete(Component.name);
	}

	removeFromParent() {
		this.parent && this.parent.remove(this);
	}

	/**
	 * @typedef BaseComponent
	 * @param {string} name
	 * @returns {BaseComponent}
	 */
	get(name) {
		return this.children.get(name);
	}
}
