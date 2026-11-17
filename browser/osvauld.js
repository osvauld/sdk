(function() {
	// \0rolldown/runtime.js
	var __defProp = Object.defineProperty;
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	// node_modules/loro-crdt/web/loro_wasm.js
	var wasm;
	var heap = new Array(128).fill(void 0);
	heap.push(void 0, null, true, false);
	function getObject(idx) {
		return heap[idx];
	}
	var WASM_VECTOR_LEN = 0;
	var cachedUint8ArrayMemory0 = null;
	function getUint8ArrayMemory0() {
		if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
		return cachedUint8ArrayMemory0;
	}
	var cachedTextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder("utf-8") : { encode: () => {
		throw Error("TextEncoder not available");
	} };
	var encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
		return cachedTextEncoder.encodeInto(arg, view);
	} : function(arg, view) {
		const buf = cachedTextEncoder.encode(arg);
		view.set(buf);
		return {
			read: arg.length,
			written: buf.length
		};
	};
	function passStringToWasm0(arg, malloc, realloc) {
		if (realloc === void 0) {
			const buf = cachedTextEncoder.encode(arg);
			const ptr = malloc(buf.length, 1) >>> 0;
			getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
			WASM_VECTOR_LEN = buf.length;
			return ptr;
		}
		let len = arg.length;
		let ptr = malloc(len, 1) >>> 0;
		const mem = getUint8ArrayMemory0();
		let offset = 0;
		for (; offset < len; offset++) {
			const code = arg.charCodeAt(offset);
			if (code > 127) break;
			mem[ptr + offset] = code;
		}
		if (offset !== len) {
			if (offset !== 0) arg = arg.slice(offset);
			ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
			const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
			const ret = encodeString(arg, view);
			offset += ret.written;
			ptr = realloc(ptr, len, offset, 1) >>> 0;
		}
		WASM_VECTOR_LEN = offset;
		return ptr;
	}
	var cachedDataViewMemory0 = null;
	function getDataViewMemory0() {
		if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
		return cachedDataViewMemory0;
	}
	var heap_next = heap.length;
	function addHeapObject(obj) {
		if (heap_next === heap.length) heap.push(heap.length + 1);
		const idx = heap_next;
		heap_next = heap[idx];
		heap[idx] = obj;
		return idx;
	}
	function handleError(f, args) {
		try {
			return f.apply(this, args);
		} catch (e) {
			wasm.__wbindgen_exn_store(addHeapObject(e));
		}
	}
	var cachedTextDecoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", {
		ignoreBOM: true,
		fatal: true
	}) : { decode: () => {
		throw Error("TextDecoder not available");
	} };
	if (typeof TextDecoder !== "undefined") cachedTextDecoder.decode();
	function getStringFromWasm0(ptr, len) {
		ptr = ptr >>> 0;
		return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
	}
	function dropObject(idx) {
		if (idx < 132) return;
		heap[idx] = heap_next;
		heap_next = idx;
	}
	function takeObject(idx) {
		const ret = getObject(idx);
		dropObject(idx);
		return ret;
	}
	function isLikeNone(x) {
		return x === void 0 || x === null;
	}
	var CLOSURE_DTORS = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((state) => {
		wasm.__wbindgen_export_4.get(state.dtor)(state.a, state.b);
	});
	function makeMutClosure(arg0, arg1, dtor, f) {
		const state = {
			a: arg0,
			b: arg1,
			cnt: 1,
			dtor
		};
		const real = (...args) => {
			state.cnt++;
			const a = state.a;
			state.a = 0;
			try {
				return f(a, state.b, ...args);
			} finally {
				if (--state.cnt === 0) {
					wasm.__wbindgen_export_4.get(state.dtor)(a, state.b);
					CLOSURE_DTORS.unregister(state);
				} else state.a = a;
			}
		};
		real.original = state;
		CLOSURE_DTORS.register(real, state, state);
		return real;
	}
	function debugString(val) {
		const type = typeof val;
		if (type == "number" || type == "boolean" || val == null) return `${val}`;
		if (type == "string") return `"${val}"`;
		if (type == "symbol") {
			const description = val.description;
			if (description == null) return "Symbol";
			else return `Symbol(${description})`;
		}
		if (type == "function") {
			const name = val.name;
			if (typeof name == "string" && name.length > 0) return `Function(${name})`;
			else return "Function";
		}
		if (Array.isArray(val)) {
			const length = val.length;
			let debug = "[";
			if (length > 0) debug += debugString(val[0]);
			for (let i = 1; i < length; i++) debug += ", " + debugString(val[i]);
			debug += "]";
			return debug;
		}
		const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
		let className;
		if (builtInMatches && builtInMatches.length > 1) className = builtInMatches[1];
		else return toString.call(val);
		if (className == "Object") try {
			return "Object(" + JSON.stringify(val) + ")";
		} catch (_) {
			return "Object";
		}
		if (val instanceof Error) return `${val.name}: ${val.message}\n${val.stack}`;
		return className;
	}
	function _assertClass(instance, klass) {
		if (!(instance instanceof klass)) throw new Error(`expected instance of ${klass.name}`);
	}
	var stack_pointer = 128;
	function addBorrowedObject(obj) {
		if (stack_pointer == 1) throw new Error("out of js stack");
		heap[--stack_pointer] = obj;
		return stack_pointer;
	}
	function passArray8ToWasm0(arg, malloc) {
		const ptr = malloc(arg.length * 1, 1) >>> 0;
		getUint8ArrayMemory0().set(arg, ptr / 1);
		WASM_VECTOR_LEN = arg.length;
		return ptr;
	}
	function getArrayU8FromWasm0(ptr, len) {
		ptr = ptr >>> 0;
		return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
	}
	function getArrayJsValueFromWasm0(ptr, len) {
		ptr = ptr >>> 0;
		const mem = getDataViewMemory0();
		const result = [];
		for (let i = ptr; i < ptr + 4 * len; i += 4) result.push(takeObject(mem.getUint32(i, true)));
		return result;
	}
	/**
	* Enable debug info of Loro
	*/
	function setDebug() {
		wasm.setDebug();
	}
	function passArrayJsValueToWasm0(array, malloc) {
		const ptr = malloc(array.length * 4, 4) >>> 0;
		const mem = getDataViewMemory0();
		for (let i = 0; i < array.length; i++) mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
		WASM_VECTOR_LEN = array.length;
		return ptr;
	}
	/**
	* @param {({ peer: PeerID, counter: number })[]} frontiers
	* @returns {Uint8Array}
	*/
	function encodeFrontiers(frontiers) {
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			const ptr0 = passArrayJsValueToWasm0(frontiers, wasm.__wbindgen_malloc);
			const len0 = WASM_VECTOR_LEN;
			wasm.encodeFrontiers(retptr, ptr0, len0);
			var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
			var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
			var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
			if (getDataViewMemory0().getInt32(retptr + 12, true)) throw takeObject(r2);
			var v2 = getArrayU8FromWasm0(r0, r1).slice();
			wasm.__wbindgen_free(r0, r1 * 1, 1);
			return v2;
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16);
		}
	}
	function callPendingEvents() {
		wasm.callPendingEvents();
	}
	/**
	* Redacts sensitive content in JSON updates within the specified version range.
	*
	* This function allows you to share document history while removing potentially sensitive content.
	* It preserves the document structure and collaboration capabilities while replacing content with
	* placeholders according to these redaction rules:
	*
	* - Preserves delete and move operations
	* - Replaces text insertion content with the Unicode replacement character
	* - Substitutes list and map insert values with null
	* - Maintains structure of child containers
	* - Replaces text mark values with null
	* - Preserves map keys and text annotation keys
	*
	* @param {Object|string} jsonUpdates - The JSON updates to redact (object or JSON string)
	* @param {Object} versionRange - Version range defining what content to redact,
	*                  format: { peerId: [startCounter, endCounter], ... }
	* @returns {Object} The redacted JSON updates
	* @param {string | JsonSchema} json_updates
	* @param {any} version_range
	* @returns {JsonSchema}
	*/
	function redactJsonUpdates(json_updates, version_range) {
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			wasm.redactJsonUpdates(retptr, addHeapObject(json_updates), addHeapObject(version_range));
			var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
			var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
			if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
			return takeObject(r0);
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16);
		}
	}
	/**
	* Get the version of Loro
	* @returns {string}
	*/
	function LORO_VERSION() {
		let deferred1_0;
		let deferred1_1;
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			wasm.LORO_VERSION(retptr);
			var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
			var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
			deferred1_0 = r0;
			deferred1_1 = r1;
			return getStringFromWasm0(r0, r1);
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16);
			wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
		}
	}
	function run() {
		wasm.run();
	}
	/**
	* Decode the metadata of the import blob.
	*
	* This method is useful to get the following metadata of the import blob:
	*
	* - startVersionVector
	* - endVersionVector
	* - startTimestamp
	* - endTimestamp
	* - mode
	* - changeNum
	* @param {Uint8Array} blob
	* @param {boolean} check_checksum
	* @returns {ImportBlobMetadata}
	*/
	function decodeImportBlobMeta(blob, check_checksum) {
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			const ptr0 = passArray8ToWasm0(blob, wasm.__wbindgen_malloc);
			const len0 = WASM_VECTOR_LEN;
			wasm.decodeImportBlobMeta(retptr, ptr0, len0, check_checksum);
			var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
			var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
			if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
			return takeObject(r0);
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16);
		}
	}
	/**
	* @param {Uint8Array} bytes
	* @returns {{ peer: PeerID, counter: number }[]}
	*/
	function decodeFrontiers(bytes) {
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
			const len0 = WASM_VECTOR_LEN;
			wasm.decodeFrontiers(retptr, ptr0, len0);
			var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
			var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
			if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
			return takeObject(r0);
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16);
		}
	}
	function __wbg_adapter_60(arg0, arg1, arg2) {
		wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h94d67f9fb1d01a91(arg0, arg1, addHeapObject(arg2));
	}
	function __wbg_adapter_63(arg0, arg1) {
		wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hb09c99a876c494ad(arg0, arg1);
	}
	var AwarenessWasmFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_awarenesswasm_free(ptr >>> 0, 1));
	/**
	* `Awareness` is a structure that tracks the ephemeral state of peers.
	*
	* It can be used to synchronize cursor positions, selections, and the names of the peers.
	*
	* The state of a specific peer is expected to be removed after a specified timeout. Use
	* `remove_outdated` to eliminate outdated states.
	*/
	var AwarenessWasm = class {
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			AwarenessWasmFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_awarenesswasm_free(ptr, 0);
		}
		/**
		* Get the state of all peers.
		* @returns {{[peer in PeerID]: unknown}}
		*/
		getAllStates() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.awarenesswasm_getAllStates(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the timestamp of the state of a given peer.
		* @param {number | bigint | `${number}`} peer
		* @returns {number | undefined}
		*/
		getTimestamp(peer) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-32);
				wasm.awarenesswasm_getTimestamp(retptr, this.__wbg_ptr, addHeapObject(peer));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r2 = getDataViewMemory0().getFloat64(retptr + 8, true);
				var r4 = getDataViewMemory0().getInt32(retptr + 16, true);
				if (getDataViewMemory0().getInt32(retptr + 20, true)) throw takeObject(r4);
				return r0 === 0 ? void 0 : r2;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(32);
			}
		}
		/**
		* Sets the state of the local peer.
		* @param {any} value
		*/
		setLocalState(value) {
			wasm.awarenesswasm_setLocalState(this.__wbg_ptr, addHeapObject(value));
		}
		/**
		* Remove the states of outdated peers.
		* @returns {PeerID[]}
		*/
		removeOutdated() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.awarenesswasm_removeOutdated(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Creates a new `Awareness` instance.
		*
		* The `timeout` parameter specifies the duration in milliseconds.
		* A state of a peer is considered outdated, if the last update of the state of the peer
		* is older than the `timeout`.
		* @param {number | bigint | `${number}`} peer
		* @param {number} timeout
		*/
		constructor(peer, timeout) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.awarenesswasm_new(retptr, addHeapObject(peer), timeout);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				this.__wbg_ptr = r0 >>> 0;
				AwarenessWasmFinalization.register(this, this.__wbg_ptr, this);
				return this;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the PeerID of the local peer.
		* @returns {PeerID}
		*/
		peer() {
			return takeObject(wasm.awarenesswasm_peer(this.__wbg_ptr));
		}
		/**
		* Applies the encoded state of peers.
		*
		* Each peer's deletion countdown will be reset upon update, requiring them to pass through the `timeout`
		* interval again before being eligible for deletion.
		* @param {Uint8Array} encoded_peers_info
		* @returns {{ updated: PeerID[], added: PeerID[] }}
		*/
		apply(encoded_peers_info) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArray8ToWasm0(encoded_peers_info, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.awarenesswasm_apply(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get all the peers
		* @returns {PeerID[]}
		*/
		peers() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.awarenesswasm_peers(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Encodes the state of the given peers.
		* @param {Array<any>} peers
		* @returns {Uint8Array}
		*/
		encode(peers) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.awarenesswasm_encode(retptr, this.__wbg_ptr, addHeapObject(peers));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
				if (getDataViewMemory0().getInt32(retptr + 12, true)) throw takeObject(r2);
				var v1 = getArrayU8FromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 1, 1);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the number of peers.
		* @returns {number}
		*/
		length() {
			return wasm.awarenesswasm_length(this.__wbg_ptr);
		}
		/**
		* If the state is empty.
		* @returns {boolean}
		*/
		isEmpty() {
			return wasm.awarenesswasm_isEmpty(this.__wbg_ptr) !== 0;
		}
		/**
		* Get the state of a given peer.
		* @param {number | bigint | `${number}`} peer
		* @returns {any}
		*/
		getState(peer) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.awarenesswasm_getState(retptr, this.__wbg_ptr, addHeapObject(peer));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Encodes the state of all peers.
		* @returns {Uint8Array}
		*/
		encodeAll() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.awarenesswasm_encodeAll(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayU8FromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 1, 1);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
	};
	var ChangeModifierFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_changemodifier_free(ptr >>> 0, 1));
	var ChangeModifier = class ChangeModifier {
		static __wrap(ptr) {
			ptr = ptr >>> 0;
			const obj = Object.create(ChangeModifier.prototype);
			obj.__wbg_ptr = ptr;
			ChangeModifierFinalization.register(obj, obj.__wbg_ptr, obj);
			return obj;
		}
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			ChangeModifierFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_changemodifier_free(ptr, 0);
		}
		/**
		* @param {string} message
		* @returns {ChangeModifier}
		*/
		setMessage(message) {
			const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			const ret = wasm.changemodifier_setMessage(this.__wbg_ptr, ptr0, len0);
			return ChangeModifier.__wrap(ret);
		}
		/**
		* @param {number} timestamp
		* @returns {ChangeModifier}
		*/
		setTimestamp(timestamp) {
			const ret = wasm.changemodifier_setTimestamp(this.__wbg_ptr, timestamp);
			return ChangeModifier.__wrap(ret);
		}
	};
	var CursorFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_cursor_free(ptr >>> 0, 1));
	/**
	* Cursor is a stable position representation in the doc.
	* When expressing the position of a cursor, using "index" can be unstable
	* because the cursor's position may change due to other deletions and insertions,
	* requiring updates with each edit. To stably represent a position or range within
	* a list structure, we can utilize the ID of each item/character on List CRDT or
	* Text CRDT for expression.
	*
	* Loro optimizes State metadata by not storing the IDs of deleted elements. This
	* approach complicates tracking cursors since they rely on these IDs. The solution
	* recalculates position by replaying relevant history to update cursors
	* accurately. To minimize the performance impact of history replay, the system
	* updates cursor info to reference only the IDs of currently present elements,
	* thereby reducing the need for replay.
	*
	* @example
	* ```ts
	*
	* const doc = new LoroDoc();
	* const text = doc.getText("text");
	* text.insert(0, "123");
	* const pos0 = text.getCursor(0, 0);
	* {
	*   const ans = doc.getCursorPos(pos0!);
	*   expect(ans.offset).toBe(0);
	* }
	* text.insert(0, "1");
	* {
	*   const ans = doc.getCursorPos(pos0!);
	*   expect(ans.offset).toBe(1);
	* }
	* ```
	*/
	var Cursor = class Cursor {
		static __wrap(ptr) {
			ptr = ptr >>> 0;
			const obj = Object.create(Cursor.prototype);
			obj.__wbg_ptr = ptr;
			CursorFinalization.register(obj, obj.__wbg_ptr, obj);
			return obj;
		}
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			CursorFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_cursor_free(ptr, 0);
		}
		/**
		* Get the id of the given container.
		* @returns {ContainerID}
		*/
		containerId() {
			return takeObject(wasm.cursor_containerId(this.__wbg_ptr));
		}
		/**
		* Get the ID that represents the position.
		*
		* It can be undefined if it's not bind into a specific ID.
		* @returns {{ peer: PeerID, counter: number } | undefined}
		*/
		pos() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.cursor_pos(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* "Cursor"
		* @returns {any}
		*/
		kind() {
			return takeObject(wasm.cursor_kind(this.__wbg_ptr));
		}
		/**
		* Get which side of the character/list item the cursor is on.
		* @returns {Side}
		*/
		side() {
			return takeObject(wasm.cursor_side(this.__wbg_ptr));
		}
		/**
		* Decode the cursor from a Uint8Array.
		* @param {Uint8Array} data
		* @returns {Cursor}
		*/
		static decode(data) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.cursor_decode(retptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return Cursor.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Encode the cursor into a Uint8Array.
		* @returns {Uint8Array}
		*/
		encode() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.cursor_encode(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayU8FromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 1, 1);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
	};
	var EphemeralStoreWasmFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_ephemeralstorewasm_free(ptr >>> 0, 1));
	var EphemeralStoreWasm = class {
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			EphemeralStoreWasmFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_ephemeralstorewasm_free(ptr, 0);
		}
		/**
		* @returns {any}
		*/
		getAllStates() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.ephemeralstorewasm_getAllStates(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		removeOutdated() {
			wasm.ephemeralstorewasm_removeOutdated(this.__wbg_ptr);
		}
		/**
		* @param {Function} f
		* @returns {any}
		*/
		subscribeLocalUpdates(f) {
			return takeObject(wasm.ephemeralstorewasm_subscribeLocalUpdates(this.__wbg_ptr, addHeapObject(f)));
		}
		/**
		* @param {string} key
		* @returns {any}
		*/
		get(key) {
			const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			return takeObject(wasm.ephemeralstorewasm_get(this.__wbg_ptr, ptr0, len0));
		}
		/**
		* Creates a new `EphemeralStore` instance.
		*
		* The `timeout` parameter specifies the duration in milliseconds.
		* A state of a peer is considered outdated, if the last update of the state of the peer
		* is older than the `timeout`.
		* @param {number} timeout
		*/
		constructor(timeout) {
			const ret = wasm.ephemeralstorewasm_new(timeout);
			this.__wbg_ptr = ret >>> 0;
			EphemeralStoreWasmFinalization.register(this, this.__wbg_ptr, this);
			return this;
		}
		/**
		* @param {string} key
		* @param {any} value
		*/
		set(key, value) {
			const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			wasm.ephemeralstorewasm_set(this.__wbg_ptr, ptr0, len0, addHeapObject(value));
		}
		/**
		* @returns {string[]}
		*/
		keys() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.ephemeralstorewasm_keys(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* @param {Uint8Array} data
		*/
		apply(data) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.ephemeralstorewasm_apply(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* @param {string} key
		*/
		delete(key) {
			const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			wasm.ephemeralstorewasm_delete(this.__wbg_ptr, ptr0, len0);
		}
		/**
		* @param {string} key
		* @returns {Uint8Array}
		*/
		encode(key) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.ephemeralstorewasm_encode(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v2 = getArrayU8FromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 1, 1);
				return v2;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* If the state is empty.
		* @returns {boolean}
		*/
		isEmpty() {
			return wasm.ephemeralstorewasm_isEmpty(this.__wbg_ptr) !== 0;
		}
		/**
		* @returns {Uint8Array}
		*/
		encodeAll() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.ephemeralstorewasm_encodeAll(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayU8FromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 1, 1);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* @param {Function} f
		* @returns {any}
		*/
		subscribe(f) {
			return takeObject(wasm.ephemeralstorewasm_subscribe(this.__wbg_ptr, addHeapObject(f)));
		}
	};
	var LoroCounterFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_lorocounter_free(ptr >>> 0, 1));
	/**
	* The handler of a counter container.
	*/
	var LoroCounter = class LoroCounter {
		static __wrap(ptr) {
			ptr = ptr >>> 0;
			const obj = Object.create(LoroCounter.prototype);
			obj.__wbg_ptr = ptr;
			LoroCounterFinalization.register(obj, obj.__wbg_ptr, obj);
			return obj;
		}
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			LoroCounterFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_lorocounter_free(ptr, 0);
		}
		/**
		* Whether the container is attached to a docuemnt.
		*
		* If it's detached, the operations on the container will not be persisted.
		* @returns {boolean}
		*/
		isAttached() {
			return wasm.lorocounter_isAttached(this.__wbg_ptr) !== 0;
		}
		/**
		* Get the attached container associated with this.
		*
		* Returns an attached `Container` that equals to this or created by this, otherwise `undefined`.
		* @returns {LoroTree | undefined}
		*/
		getAttached() {
			return takeObject(wasm.lorocounter_getAttached(this.__wbg_ptr));
		}
		/**
		* Get the value of the counter.
		* @returns {number}
		*/
		getShallowValue() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorocounter_getShallowValue(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getFloat64(retptr + 0, true);
				var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
				if (getDataViewMemory0().getInt32(retptr + 12, true)) throw takeObject(r2);
				return r0;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* The container id of this handler.
		* @returns {ContainerID}
		*/
		get id() {
			return takeObject(wasm.lorocounter_id(this.__wbg_ptr));
		}
		/**
		* Create a new LoroCounter.
		*/
		constructor() {
			const ret = wasm.lorocounter_new();
			this.__wbg_ptr = ret >>> 0;
			LoroCounterFinalization.register(this, this.__wbg_ptr, this);
			return this;
		}
		/**
		* "Counter"
		* @returns {'Counter'}
		*/
		kind() {
			return takeObject(wasm.lorocounter_kind(this.__wbg_ptr));
		}
		/**
		* Get the parent container of the counter container.
		*
		* - The parent container of the root counter is `undefined`.
		* - The object returned is a new js object each time because it need to cross
		*   the WASM boundary.
		* @returns {Container | undefined}
		*/
		parent() {
			return takeObject(wasm.lorocounter_parent(this.__wbg_ptr));
		}
		/**
		* @returns {number}
		*/
		toJSON() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorocounter_getShallowValue(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getFloat64(retptr + 0, true);
				var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
				if (getDataViewMemory0().getInt32(retptr + 12, true)) throw takeObject(r2);
				return r0;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Decrement the counter by the given value.
		* @param {number} value
		*/
		decrement(value) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorocounter_decrement(retptr, this.__wbg_ptr, value);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the value of the counter.
		* @returns {number}
		*/
		get value() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorocounter_getShallowValue(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getFloat64(retptr + 0, true);
				var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
				if (getDataViewMemory0().getInt32(retptr + 12, true)) throw takeObject(r2);
				return r0;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Increment the counter by the given value.
		* @param {number} value
		*/
		increment(value) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorocounter_increment(retptr, this.__wbg_ptr, value);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Subscribe to the changes of the counter.
		* @param {Function} f
		* @returns {any}
		*/
		subscribe(f) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorocounter_subscribe(retptr, this.__wbg_ptr, addHeapObject(f));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
	};
	var LoroDocFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_lorodoc_free(ptr >>> 0, 1));
	/**
	* The CRDTs document. Loro supports different CRDTs include [**List**](LoroList),
	* [**RichText**](LoroText), [**Map**](LoroMap) and [**Movable Tree**](LoroTree),
	* you could build all kind of applications by these.
	*
	* **Important:** Loro is a pure library and does not handle network protocols.
	* It is the responsibility of the user to manage the storage, loading, and synchronization
	* of the bytes exported by Loro in a manner suitable for their specific environment.
	*
	* @example
	* ```ts
	* import { LoroDoc } from "loro-crdt"
	*
	* const loro = new LoroDoc();
	* const text = loro.getText("text");
	* const list = loro.getList("list");
	* const map = loro.getMap("Map");
	* const tree = loro.getTree("tree");
	* ```
	*/
	var LoroDoc = class LoroDoc {
		static __wrap(ptr) {
			ptr = ptr >>> 0;
			const obj = Object.create(LoroDoc.prototype);
			obj.__wbg_ptr = ptr;
			LoroDocFinalization.register(obj, obj.__wbg_ptr, obj);
			return obj;
		}
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			LoroDocFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_lorodoc_free(ptr, 0);
		}
		/**
		* Apply a batch of diff to the document
		*
		* A diff batch represents a set of changes between two versions of the document.
		* You can calculate a diff batch using `doc.diff()`.
		*
		* Changes are associated with container IDs. During diff application, if new containers were created in the source
		* document, they will be assigned fresh IDs in the target document. Loro automatically handles remapping these
		* container IDs from their original IDs to the new IDs as the diff is applied.
		*
		* @example
		* ```ts
		* const doc1 = new LoroDoc();
		* const doc2 = new LoroDoc();
		*
		* // Make some changes to doc1
		* const text = doc1.getText("text");
		* text.insert(0, "Hello");
		*
		* // Calculate diff between empty and current state
		* const diff = doc1.diff([], doc1.frontiers());
		*
		* // Apply changes to doc2
		* doc2.applyDiff(diff);
		* console.log(doc2.getText("text").toString()); // "Hello"
		* ```
		* @param {[ContainerID, Diff|JsonDiff][]} diff
		*/
		applyDiff(diff) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_applyDiff(retptr, this.__wbg_ptr, addHeapObject(diff));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Check if the doc contains the full history.
		* @returns {boolean}
		*/
		isShallow() {
			return wasm.lorodoc_isShallow(this.__wbg_ptr) !== 0;
		}
		/**
		* Get the number of changes in the oplog.
		* @returns {number}
		*/
		changeCount() {
			return wasm.lorodoc_changeCount(this.__wbg_ptr) >>> 0;
		}
		/**
		* Get the value or container at the given path
		*
		* The path can be specified in different ways depending on the container type:
		*
		* For Tree:
		* 1. Using node IDs: `tree/{node_id}/property`
		* 2. Using indices: `tree/0/1/property`
		*
		* For List and MovableList:
		* - Using indices: `list/0` or `list/1/property`
		*
		* For Map:
		* - Using keys: `map/key` or `map/nested/property`
		*
		* For tree structures, index-based paths follow depth-first traversal order.
		* The indices start from 0 and represent the position of a node among its siblings.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* map.set("key", 1);
		* console.log(doc.getByPath("map/key")); // 1
		* console.log(doc.getByPath("map"));     // LoroMap
		* ```
		* @param {string} path
		* @returns {Value | Container | undefined}
		*/
		getByPath(path) {
			const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			return takeObject(wasm.lorodoc_getByPath(this.__wbg_ptr, ptr0, len0));
		}
		/**
		* Get a LoroCounter by container id
		*
		* If the container does not exist, an error will be thrown.
		* @param {ContainerID | string} cid
		* @returns {LoroCounter}
		*/
		getCounter(cid) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getCounter(retptr, this.__wbg_ptr, addBorrowedObject(cid));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroCounter.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* `detached` indicates that the `DocState` is not synchronized with the latest version of `OpLog`.
		*
		* > The document becomes detached during a `checkout` operation.
		* > Being `detached` implies that the `DocState` is not synchronized with the latest version of the `OpLog`.
		* > In a detached state, the document is not editable by default, and any `import` operations will be
		* > recorded in the `OpLog` without being applied to the `DocState`.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* const frontiers = doc.frontiers();
		* text.insert(0, "Hello World!");
		* console.log(doc.isDetached());  // false
		* doc.checkout(frontiers);
		* console.log(doc.isDetached());  // true
		* doc.attach();
		* console.log(doc.isDetached());  // false
		* ```
		* @returns {boolean}
		*/
		isDetached() {
			return wasm.lorodoc_isDetached(this.__wbg_ptr) !== 0;
		}
		/**
		* Get peer id in decimal string.
		* @returns {PeerID}
		*/
		get peerIdStr() {
			return takeObject(wasm.lorodoc_peerIdStr(this.__wbg_ptr));
		}
		/**
		* Set the peer ID of the current writer.
		*
		* It must be a number, a BigInt, or a decimal string that can be parsed to a unsigned 64-bit integer.
		*
		* Note: use it with caution. You need to make sure there is not chance that two peers
		* have the same peer ID. Otherwise, we cannot ensure the consistency of the document.
		* @param {number | bigint | `${number}`} peer_id
		*/
		setPeerId(peer_id) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_setPeerId(retptr, this.__wbg_ptr, addHeapObject(peer_id));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the absolute position of the given Cursor
		*
		* @example
		* ```ts
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "123");
		* const pos0 = text.getCursor(0, 0);
		* {
		*    const ans = doc.getCursorPos(pos0!);
		*    expect(ans.offset).toBe(0);
		* }
		* text.insert(0, "1");
		* {
		*    const ans = doc.getCursorPos(pos0!);
		*    expect(ans.offset).toBe(1);
		* }
		* ```
		* @param {Cursor} cursor
		* @returns {{ update?: Cursor, offset: number, side: Side } | undefined}
		*/
		getCursorPos(cursor) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				_assertClass(cursor, Cursor);
				wasm.lorodoc_getCursorPos(retptr, this.__wbg_ptr, cursor.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Check if the doc contains the target container.
		*
		* A root container always exists, while a normal container exists
		* if it has ever been created on the doc.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroMap, LoroText, LoroList } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* doc.setPeerId("1");
		* const text = doc.getMap("map").setContainer("text", new LoroText());
		* const list = doc.getMap("map").setContainer("list", new LoroList());
		* expect(doc.isContainerExists("cid:root-map:Map")).toBe(true);
		* expect(doc.isContainerExists("cid:0@1:Text")).toBe(true);
		* expect(doc.isContainerExists("cid:1@1:List")).toBe(true);
		*
		* const doc2 = new LoroDoc();
		* // Containers exist, as long as the history or the doc state include it
		* doc.detach();
		* doc2.import(doc.export({ mode: "update" }));
		* expect(doc2.isContainerExists("cid:root-map:Map")).toBe(true);
		* expect(doc2.isContainerExists("cid:0@1:Text")).toBe(true);
		* expect(doc2.isContainerExists("cid:1@1:List")).toBe(true);
		* ```
		* @param {ContainerID} container_id
		* @returns {boolean}
		*/
		hasContainer(container_id) {
			return wasm.lorodoc_hasContainer(this.__wbg_ptr, addHeapObject(container_id)) !== 0;
		}
		/**
		* Import a batch of updates or snapshots.
		*
		* It's more efficient than importing updates one by one.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* const updates = doc.export({ mode: "update" });
		* const snapshot = doc.export({ mode: "snapshot" });
		* const doc2 = new LoroDoc();
		* doc2.importBatch([snapshot, updates]);
		* ```
		* @param {Uint8Array[]} data
		* @returns {ImportStatus}
		*/
		importBatch(data) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_importBatch(retptr, this.__wbg_ptr, addHeapObject(data));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Compare the ordering of two Frontiers.
		*
		* It's assumed that both Frontiers are included by the doc. Otherwise, an error will be thrown.
		*
		* Return value:
		*
		* - -1: a < b
		* - 0: a == b
		* - 1: a > b
		* - undefined: a ∥ b: a and b are concurrent
		* @param {({ peer: PeerID, counter: number })[]} a
		* @param {({ peer: PeerID, counter: number })[]} b
		* @returns {-1 | 1 | 0 | undefined}
		*/
		cmpFrontiers(a, b) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArrayJsValueToWasm0(a, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				const ptr1 = passArrayJsValueToWasm0(b, wasm.__wbindgen_malloc);
				const len1 = WASM_VECTOR_LEN;
				wasm.lorodoc_cmpFrontiers(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Debug the size of the history
		*/
		debugHistory() {
			wasm.lorodoc_debugHistory(this.__wbg_ptr);
		}
		/**
		* Create a loro document from the snapshot.
		*
		* @see You can learn more [here](https://loro.dev/docs/tutorial/encoding).
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt"
		*
		* const doc = new LoroDoc();
		* // ...
		* const bytes = doc.export({ mode: "snapshot" });
		* const loro = LoroDoc.fromSnapshot(bytes);
		* ```
		* @param {Uint8Array} snapshot
		* @returns {LoroDoc}
		*/
		static fromSnapshot(snapshot) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArray8ToWasm0(snapshot, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorodoc_fromSnapshot(retptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroDoc.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the change that contains the specific ID
		* @param {{ peer: PeerID, counter: number }} id
		* @returns {Change}
		*/
		getChangeAt(id) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getChangeAt(retptr, this.__wbg_ptr, addHeapObject(id));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the version vector of the latest known version in OpLog.
		*
		* If you checkout to a specific version, this version vector will not change.
		* @returns {VersionVector}
		*/
		oplogVersion() {
			const ret = wasm.lorodoc_oplogVersion(this.__wbg_ptr);
			return VersionVector.__wrap(ret);
		}
		/**
		* Get a LoroMovableList by container id
		*
		* The object returned is a new js object each time because it need to cross
		* the WASM boundary.
		*
		* If the container does not exist, an error will be thrown.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getMovableList("list");
		* ```
		* @param {ContainerID | string} cid
		* @returns {LoroMovableList}
		*/
		getMovableList(cid) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getMovableList(retptr, this.__wbg_ptr, addBorrowedObject(cid));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroMovableList.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Convert frontiers to a version vector
		*
		* Learn more about frontiers and version vector [here](https://loro.dev/docs/advanced/version_deep_dive)
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* const frontiers = doc.frontiers();
		* const version = doc.frontiersToVV(frontiers);
		* ```
		* @param {({ peer: PeerID, counter: number })[]} frontiers
		* @returns {VersionVector}
		*/
		frontiersToVV(frontiers) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArrayJsValueToWasm0(frontiers, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorodoc_frontiersToVV(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return VersionVector.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get all of changes in the oplog.
		*
		* Note: this method is expensive when the oplog is large. O(n)
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* const changes = doc.getAllChanges();
		*
		* for (let [peer, c] of changes.entries()){
		*     console.log("peer: ", peer);
		*     for (let change of c){
		*         console.log("change: ", change);
		*     }
		* }
		* ```
		* @returns {Map<PeerID, Change[]>}
		*/
		getAllChanges() {
			return takeObject(wasm.lorodoc_getAllChanges(this.__wbg_ptr));
		}
		/**
		* Get the [frontiers](https://loro.dev/docs/advanced/version_deep_dive) of the latest version in OpLog.
		*
		* If you checkout to a specific version, this value will not change.
		* @returns {{ peer: PeerID, counter: number }[]}
		*/
		oplogFrontiers() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_oplogFrontiers(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Convert a version vector to frontiers
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* const version = doc.version();
		* const frontiers = doc.vvToFrontiers(version);
		* ```
		* @param {VersionVector} vv
		* @returns {{ peer: PeerID, counter: number }[]}
		*/
		vvToFrontiers(vv) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				_assertClass(vv, VersionVector);
				wasm.lorodoc_vvToFrontiers(retptr, this.__wbg_ptr, vv.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* The doc only contains the history since this version
		*
		* This is empty if the doc is not shallow.
		*
		* The ops included by the shallow history start version vector are not in the doc.
		* @returns {VersionVector}
		*/
		shallowSinceVV() {
			const ret = wasm.lorodoc_shallowSinceVV(this.__wbg_ptr);
			return VersionVector.__wrap(ret);
		}
		/**
		* Set the rich text format configuration of the document.
		*
		* You need to config it if you use rich text `mark` method.
		* Specifically, you need to config the `expand` property of each style.
		*
		* Expand is used to specify the behavior of expanding when new text is inserted at the
		* beginning or end of the style.
		*
		* You can specify the `expand` option to set the behavior when inserting text at the boundary of the range.
		*
		* - `after`(default): when inserting text right after the given range, the mark will be expanded to include the inserted text
		* - `before`: when inserting text right before the given range, the mark will be expanded to include the inserted text
		* - `none`: the mark will not be expanded to include the inserted text at the boundaries
		* - `both`: when inserting text either right before or right after the given range, the mark will be expanded to include the inserted text
		*
		* @example
		* ```ts
		* const doc = new LoroDoc();
		* doc.configTextStyle({
		*   bold: { expand: "after" },
		*   link: { expand: "before" }
		* });
		* const text = doc.getText("text");
		* text.insert(0, "Hello World!");
		* text.mark({ start: 0, end: 5 }, "bold", true);
		* expect(text.toDelta()).toStrictEqual([
		*   {
		*     insert: "Hello",
		*     attributes: {
		*       bold: true,
		*     },
		*   },
		*   {
		*     insert: " World!",
		*   },
		* ] as Delta<string>[]);
		* ```
		* @param {{[key: string]: { expand: 'before'|'after'|'none'|'both' }}} styles
		*/
		configTextStyle(styles) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_configTextStyle(retptr, this.__wbg_ptr, addHeapObject(styles));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get all ops of the change that contains the specific ID
		* @param {{ peer: PeerID, counter: number }} id
		* @returns {any[]}
		*/
		getOpsInChange(id) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getOpsInChange(retptr, this.__wbg_ptr, addHeapObject(id));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
				if (getDataViewMemory0().getInt32(retptr + 12, true)) throw takeObject(r2);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the shallow json format of the document state.
		*
		* Unlike `toJSON()` which recursively resolves all containers to their values,
		* `getShallowValue()` returns container IDs as strings for any nested containers.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* const tree = doc.getTree("tree");
		* const map = doc.getMap("map");
		* const shallowValue = doc.getShallowValue();
		* console.log(shallowValue);
		* // {
		* //   list: 'cid:root-list:List',
		* //   tree: 'cid:root-tree:Tree',
		* //   map: 'cid:root-map:Map'
		* // }
		*
		* // It points to the same container as `list`
		* const listB = doc.getContainerById(shallowValue.list);
		* ```
		* @returns {Record<string, ContainerID>}
		*/
		getShallowValue() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getShallowValue(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Checkout the `DocState` to the latest version of `OpLog`.
		*
		* > The document becomes detached during a `checkout` operation.
		* > Being `detached` implies that the `DocState` is not synchronized with the latest version of the `OpLog`.
		* > In a detached state, the document is not editable by default, and any `import` operations will be
		* > recorded in the `OpLog` without being applied to the `DocState`.
		*
		* This has the same effect as `attach`.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* const frontiers = doc.frontiers();
		* text.insert(0, "Hello World!");
		* doc.checkout(frontiers);
		* // you need call `checkoutToLatest()` or `attach()` before changing the doc.
		* doc.checkoutToLatest();
		* text.insert(0, "Hi");
		* ```
		*/
		checkoutToLatest() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_checkoutToLatest(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Compare the version of the OpLog with the specified frontiers.
		*
		* This method is useful to compare the version by only a small amount of data.
		*
		* This method returns an integer indicating the relationship between the version of the OpLog (referred to as 'self')
		* and the provided 'frontiers' parameter:
		*
		* - -1: The version of 'self' is either less than 'frontiers' or is non-comparable (parallel) to 'frontiers',
		*        indicating that it is not definitively less than 'frontiers'.
		* - 0: The version of 'self' is equal to 'frontiers'.
		* - 1: The version of 'self' is greater than 'frontiers'.
		*
		* # Internal
		*
		* Frontiers cannot be compared without the history of the OpLog.
		* @param {({ peer: PeerID, counter: number })[]} frontiers
		* @returns {number}
		*/
		cmpWithFrontiers(frontiers) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArrayJsValueToWasm0(frontiers, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorodoc_cmpWithFrontiers(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return r0;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* @param {{ peer: PeerID, counter: number, length: number }} idSpan
		* @returns {any}
		*/
		exportJsonInIdSpan(idSpan) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_exportJsonInIdSpan(retptr, this.__wbg_ptr, addHeapObject(idSpan));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Subscribe to changes that may affect a JSONPath query.
		*
		* The callback receives no query result; it is a lightweight notifier and may
		* fire false positives so callers can debounce/throttle before running JSONPath
		* themselves.
		* @param {string} jsonpath
		* @param {Function} f
		* @returns {any}
		*/
		subscribeJsonpath(jsonpath, f) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(jsonpath, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorodoc_subscribeJsonpath(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(f));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Delete all content from a root container and hide it from the document.
		*
		* When a root container is empty and hidden:
		* - It won't show up in `get_deep_value()` results
		* - It won't be included in document snapshots
		*
		* Only works on root containers (containers without parents).
		* @param {ContainerID} cid
		*/
		deleteRootContainer(cid) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_deleteRootContainer(retptr, this.__wbg_ptr, addHeapObject(cid));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Export updates in the given range in JSON format.
		* @param {any} start_vv
		* @param {any} end_vv
		* @param {boolean | null} [with_peer_compression]
		* @returns {JsonSchema}
		*/
		exportJsonUpdates(start_vv, end_vv, with_peer_compression) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_exportJsonUpdates(retptr, this.__wbg_ptr, addHeapObject(start_vv), addHeapObject(end_vv), isLikeNone(with_peer_compression) ? 16777215 : with_peer_compression ? 1 : 0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the container corresponding to the container id.
		*
		* If the container does not exist, it returns `undefined`.
		*
		* A mergeable container (created via `ensureMergeableMap` and friends) is resolvable
		* right after it has been ensured — even before any op is written into it — for as
		* long as the parent map's child ref is alive. A mergeable container id that was
		* never ensured on this doc resolves to `undefined`.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* let text = doc.getText("text");
		* const textId = text.id;
		* text = doc.getContainerById(textId);
		* ```
		* @param {ContainerID} container_id
		* @returns {any}
		*/
		getContainerById(container_id) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getContainerById(retptr, this.__wbg_ptr, addHeapObject(container_id));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the number of operations in the pending transaction.
		*
		* The pending transaction is the one that is not committed yet. It will be committed
		* automatically after calling `doc.commit()`, `doc.export(mode)` or `doc.checkout(version)`.
		* @returns {number}
		*/
		getPendingTxnLength() {
			return wasm.lorodoc_getPendingTxnLength(this.__wbg_ptr) >>> 0;
		}
		/**
		* Import updates from the JSON format.
		*
		* only supports backward compatibility but not forward compatibility.
		* @param {string | JsonSchema} json
		* @returns {ImportStatus}
		*/
		importJsonUpdates(json) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_importJsonUpdates(retptr, this.__wbg_ptr, addHeapObject(json));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Import a batch of updates and snapshots.
		*
		* It's more efficient than importing updates one by one.
		*
		* @deprecated Use `importBatch` instead.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* const updates = doc.export({ mode: "update" });
		* const snapshot = doc.export({ mode: "snapshot" });
		* const doc2 = new LoroDoc();
		* doc2.importBatch([snapshot, updates]);
		* ```
		* @param {Uint8Array[]} data
		* @returns {ImportStatus}
		*/
		importUpdateBatch(data) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_importBatch(retptr, this.__wbg_ptr, addHeapObject(data));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Enables editing in detached mode, which is disabled by default.
		*
		* The doc enter detached mode after calling `detach` or checking out a non-latest version.
		*
		* # Important Notes:
		*
		* - This mode uses a different PeerID for each checkout.
		* - Ensure no concurrent operations share the same PeerID if set manually.
		* - Importing does not affect the document's state or version; changes are
		*   recorded in the [OpLog] only. Call `checkout` to apply changes.
		* @param {boolean} enable
		*/
		setDetachedEditing(enable) {
			wasm.lorodoc_setDetachedEditing(this.__wbg_ptr, enable);
		}
		/**
		* Set whether to record the timestamp of each change. Default is `false`.
		*
		* If enabled, the Unix timestamp (in seconds) will be recorded for each change automatically.
		*
		* You can also set each timestamp manually when you commit a change.
		* The timestamp manually set will override the automatic one.
		*
		* NOTE: Timestamps are forced to be in ascending order in the OpLog's history.
		* If you commit a new change with a timestamp that is less than the existing one,
		* the largest existing timestamp will be used instead.
		* @param {boolean} auto_record
		*/
		setRecordTimestamp(auto_record) {
			wasm.lorodoc_setRecordTimestamp(this.__wbg_ptr, auto_record);
		}
		/**
		* Subscribe to the pre-commit event.
		*
		* The callback will be called when the changes are committed but not yet applied to the OpLog.
		* You can modify the commit message and timestamp in the callback by `ChangeModifier`.
		* @param {Function} f
		* @returns {any}
		*/
		subscribePreCommit(f) {
			return takeObject(wasm.lorodoc_subscribePreCommit(this.__wbg_ptr, addHeapObject(f)));
		}
		/**
		* Find the op id spans that between the `from` version and the `to` version.
		*
		* You can combine it with `exportJsonInIdSpan` to get the changes between two versions.
		*
		* You can use it to travel all the changes from `from` to `to`. `from` and `to` are frontiers,
		* and they can be concurrent to each other. You can use it to find all the changes related to an event:
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const docA = new LoroDoc();
		* docA.setPeerId("1");
		* const docB = new LoroDoc();
		*
		* docA.getText("text").update("Hello");
		* docA.commit();
		* const snapshot = docA.export({ mode: "snapshot" });
		* let done = false;
		* docB.subscribe(e => {
		*   const spans = docB.findIdSpansBetween(e.from, e.to);
		*   const changes = docB.exportJsonInIdSpan(spans.forward[0]);
		*   console.log(changes);
		*   // [{
		*   //   id: "0@1",
		*   //   timestamp: expect.any(Number),
		*   //   deps: [],
		*   //   lamport: 0,
		*   //   msg: undefined,
		*   //   ops: [{
		*   //     container: "cid:root-text:Text",
		*   //     counter: 0,
		*   //     content: {
		*   //       type: "insert",
		*   //       pos: 0,
		*   //       text: "Hello"
		*   //     }
		*   //   }]
		*   // }]
		* });
		* docB.import(snapshot);
		* ```
		* @param {({ peer: PeerID, counter: number })[]} from
		* @param {({ peer: PeerID, counter: number })[]} to
		* @returns {VersionVectorDiff}
		*/
		findIdSpansBetween(from, to) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArrayJsValueToWasm0(from, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				const ptr1 = passArrayJsValueToWasm0(to, wasm.__wbindgen_malloc);
				const len1 = WASM_VECTOR_LEN;
				wasm.lorodoc_findIdSpansBetween(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the change of with specific peer_id and lamport <= given lamport
		* @param {string} peer_id
		* @param {number} lamport
		* @returns {Change | undefined}
		*/
		getChangeAtLamport(peer_id, lamport) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(peer_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorodoc_getChangeAtLamport(retptr, this.__wbg_ptr, ptr0, len0, lamport);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the path from the root to the container
		* @param {ContainerID} id
		* @returns {(string|number)[] | undefined}
		*/
		getPathToContainer(id) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getPathToContainer(retptr, this.__wbg_ptr, addHeapObject(id));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Gets container IDs modified in the given ID range.
		*
		* **NOTE:** This method will implicitly commit.
		*
		* This method identifies which containers were affected by changes in a given range of operations.
		* It can be used together with `doc.travelChangeAncestors()` to analyze the history of changes
		* and determine which containers were modified by each change.
		*
		* @param id - The starting ID of the change range
		* @param len - The length of the change range to check
		* @returns An array of container IDs that were modified in the given range
		* @param {{ peer: PeerID, counter: number }} id
		* @param {number} len
		* @returns {ContainerID[]}
		*/
		getChangedContainersIn(id, len) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getChangedContainersIn(retptr, this.__wbg_ptr, addHeapObject(id), len);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
				if (getDataViewMemory0().getInt32(retptr + 12, true)) throw takeObject(r2);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get deep value of the document with container id
		* @returns {any}
		*/
		getDeepValueWithID() {
			return takeObject(wasm.lorodoc_getDeepValueWithID(this.__wbg_ptr));
		}
		/**
		* Set the origin of the next commit
		* @param {string} origin
		*/
		setNextCommitOrigin(origin) {
			const ptr0 = passStringToWasm0(origin, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			wasm.lorodoc_setNextCommitOrigin(this.__wbg_ptr, ptr0, len0);
		}
		/**
		* Get the pending operations from the current transaction in JSON format
		*
		* This method returns a JSON representation of operations that have been applied
		* but not yet committed in the current transaction.
		*
		* It will use the same data format as `doc.exportJsonUpdates()`
		*
		* @example
		* ```ts
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* // Get pending ops before commit
		* const pendingOps = doc.getPendingOpsFromCurrentTxnAsJson();
		* doc.commit();
		* const emptyOps = doc.getPendingOpsFromCurrentTxnAsJson(); // this is undefined
		* ```
		* @returns {JsonSchema | undefined}
		*/
		getUncommittedOpsAsJson() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getUncommittedOpsAsJson(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Set the commit message of the next commit
		* @param {string} msg
		*/
		setNextCommitMessage(msg) {
			const ptr0 = passStringToWasm0(msg, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			wasm.lorodoc_setNextCommitMessage(this.__wbg_ptr, ptr0, len0);
		}
		/**
		* Set the options of the next commit
		* @param {{ origin?: string, timestamp?: number, message?: string }} options
		*/
		setNextCommitOptions(options) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_setNextCommitOptions(retptr, this.__wbg_ptr, addHeapObject(options));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* The doc only contains the history since this version
		*
		* This is empty if the doc is not shallow.
		*
		* The ops included by the shallow history start frontiers are not in the doc.
		* @returns {{ peer: PeerID, counter: number }[]}
		*/
		shallowSinceFrontiers() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_shallowSinceFrontiers(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Subscribe the updates from local edits
		* @param {Function} f
		* @returns {any}
		*/
		subscribeLocalUpdates(f) {
			return takeObject(wasm.lorodoc_subscribeLocalUpdates(this.__wbg_ptr, addHeapObject(f)));
		}
		/**
		* Visit all the ancestors of the changes in causal order.
		*
		* @param ids - the changes to visit
		* @param f - the callback function, return `true` to continue visiting, return `false` to stop
		* @param {({ peer: PeerID, counter: number })[]} ids
		* @param {(change: Change) => boolean} f
		*/
		travelChangeAncestors(ids, f) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArrayJsValueToWasm0(ids, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorodoc_travelChangeAncestors(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(f));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Clear the options of the next commit
		*/
		clearNextCommitOptions() {
			wasm.lorodoc_clearNextCommitOptions(this.__wbg_ptr);
		}
		/**
		* Configures the default text style for the document.
		*
		* This method sets the default text style configuration for the document when using LoroText.
		* If `None` is provided, the default style is reset.
		* @param {{ expand: 'before'|'after'|'none'|'both' } | undefined} style
		*/
		configDefaultTextStyle(style) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_configDefaultTextStyle(retptr, this.__wbg_ptr, addHeapObject(style));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* If two continuous local changes are within (<=) the interval(**in seconds**), they will be merged into one change.
		*
		* The default value is 1_000 seconds.
		*
		* By default, we record timestamps in seconds for each change. So if the merge interval is 1, and changes A and B
		* have timestamps of 3 and 4 respectively, then they will be merged into one change
		* @param {number} interval
		*/
		setChangeMergeInterval(interval) {
			wasm.lorodoc_setChangeMergeInterval(this.__wbg_ptr, interval);
		}
		/**
		* Set the timestamp of the next commit
		* @param {number} timestamp
		*/
		setNextCommitTimestamp(timestamp) {
			wasm.lorodoc_setNextCommitTimestamp(this.__wbg_ptr, timestamp);
		}
		/**
		* Set whether to hide empty root containers.
		*
		* @example
		* ```ts
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* console.log(doc.toJSON()); // { map: {} }
		* doc.setHideEmptyRootContainers(true);
		* console.log(doc.toJSON()); // {}
		* ```
		* @param {boolean} hide
		*/
		setHideEmptyRootContainers(hide) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_setHideEmptyRootContainers(retptr, this.__wbg_ptr, hide);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Whether the editing is enabled in detached mode.
		*
		* The doc enter detached mode after calling `detach` or checking out a non-latest version.
		*
		* # Important Notes:
		*
		* - This mode uses a different PeerID for each checkout.
		* - Ensure no concurrent operations share the same PeerID if set manually.
		* - Importing does not affect the document's state or version; changes are
		*   recorded in the [OpLog] only. Call `checkout` to apply changes.
		* @returns {boolean}
		*/
		isDetachedEditingEnabled() {
			return wasm.lorodoc_isDetachedEditingEnabled(this.__wbg_ptr) !== 0;
		}
		/**
		* @param {Function} f
		* @returns {any}
		*/
		subscribeFirstCommitFromPeer(f) {
			return takeObject(wasm.lorodoc_subscribeFirstCommitFromPeer(this.__wbg_ptr, addHeapObject(f)));
		}
		/**
		* Create a new loro document.
		*
		* New document will have a random peer id.
		*/
		constructor() {
			const ret = wasm.lorodoc_new();
			this.__wbg_ptr = ret >>> 0;
			LoroDocFinalization.register(this, this.__wbg_ptr, this);
			return this;
		}
		/**
		* Calculate the differences between two frontiers
		*
		* The entries in the returned object are sorted by causal order: the creation of a child container will be
		* presented before its use.
		* @param {({ peer: PeerID, counter: number })[]} from
		* @param {({ peer: PeerID, counter: number })[]} to
		* @param {boolean | null} [for_json]
		* @returns {[ContainerID, Diff|JsonDiff][]}
		*/
		diff(from, to, for_json) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArrayJsValueToWasm0(from, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				const ptr1 = passArrayJsValueToWasm0(to, wasm.__wbindgen_malloc);
				const len1 = WASM_VECTOR_LEN;
				wasm.lorodoc_diff(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1, isLikeNone(for_json) ? 16777215 : for_json ? 1 : 0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Duplicate the document with a different PeerID
		*
		* The time complexity and space complexity of this operation are both O(n),
		*
		* When called in detached mode, it will fork at the current state frontiers.
		* It will have the same effect as `forkAt(&self.frontiers())`.
		* @returns {LoroDoc}
		*/
		fork() {
			const ret = wasm.lorodoc_fork(this.__wbg_ptr);
			return LoroDoc.__wrap(ret);
		}
		/**
		* Attach the document state to the latest known version.
		*
		* > The document becomes detached during a `checkout` operation.
		* > Being `detached` implies that the `DocState` is not synchronized with the latest version of the `OpLog`.
		* > In a detached state, the document is not editable, and any `import` operations will be
		* > recorded in the `OpLog` without being applied to the `DocState`.
		*
		* This method has the same effect as invoking `checkoutToLatest`.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* const frontiers = doc.frontiers();
		* text.insert(0, "Hello World!");
		* doc.checkout(frontiers);
		* // you need call `attach()` or `checkoutToLatest()` before changing the doc.
		* doc.attach();
		* text.insert(0, "Hi");
		* ```
		*/
		attach() {
			wasm.lorodoc_attach(this.__wbg_ptr);
		}
		/**
		* Commit the cumulative auto-committed transaction.
		*
		* You can specify the `origin`, `timestamp`, and `message` of the commit.
		*
		* - The `origin` is used to mark the event
		* - The `message` works like a git commit message, which will be recorded and synced to peers
		* - The `timestamp` is the number of seconds that have elapsed since 00:00:00 UTC on January 1, 1970.
		*   It defaults to `Date.now() / 1000` when timestamp recording is enabled
		*
		* The events will be emitted after a transaction is committed. A transaction is committed when:
		*
		* - `doc.commit()` is called.
		* - `doc.export(mode)` is called.
		* - `doc.import(data)` is called.
		* - `doc.checkout(version)` is called.
		*
		* NOTE: Timestamps are forced to be in ascending order.
		* If you commit a new change with a timestamp that is less than the existing one,
		* the largest existing timestamp will be used instead.
		*
		* NOTE: The `origin` will not be persisted, but the `message` will.
		*
		* Behavior on empty commits:
		* - This method is an explicit commit. If the pending transaction is empty, any provided
		*   options (message/timestamp/origin) are swallowed and will not carry over to the next commit.
		* - Implicit commits triggered by `export`/`checkout` act as processing barriers. If the
		*   transaction is empty in those cases, `message`/`timestamp`/`origin` are preserved for the
		*   next commit.
		* @param {{ origin?: string, timestamp?: number, message?: string } | null} [options]
		*/
		commit(options) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_commit(retptr, this.__wbg_ptr, isLikeNone(options) ? 0 : addHeapObject(options));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Detach the document state from the latest known version.
		*
		* After detaching, all import operations will be recorded in the `OpLog` without being applied to the `DocState`.
		* When `detached`, the document is not editable.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* doc.detach();
		* console.log(doc.isDetached());  // true
		* ```
		*/
		detach() {
			wasm.lorodoc_detach(this.__wbg_ptr);
		}
		/**
		* Export the document based on the specified ExportMode.
		*
		* @param mode - The export mode to use. Can be one of:
		*   - `{ mode: "snapshot" }`: Export a full snapshot of the document.
		*   - `{ mode: "update", from?: VersionVector }`: Export updates from the given version vector.
		*     If `from` is not provided, it will export the whole history of the document.
		*   - `{ mode: "updates-in-range", spans: { id: ID, len: number }[] }`: Export updates within the specified ID spans.
		*   - `{ mode: "shallow-snapshot", frontiers: Frontiers }`: Export a garbage-collected snapshot up to the given frontiers.
		*
		* @returns A byte array containing the exported data.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* doc.setPeerId("1");
		* doc.getText("text").update("Hello World");
		*
		* // Export a full snapshot
		* const snapshotBytes = doc.export({ mode: "snapshot" });
		*
		* // Export updates from a specific version
		* const vv = doc.oplogVersion();
		* doc.getText("text").update("Hello Loro");
		* const updateBytes = doc.export({ mode: "update", from: vv });
		*
		* // Export a shallow snapshot that only includes the history since the frontiers
		* const shallowBytes = doc.export({ mode: "shallow-snapshot", frontiers: doc.oplogFrontiers() });
		*
		* // Export updates within specific ID spans
		* const spanBytes = doc.export({
		*   mode: "updates-in-range",
		*   spans: [{ id: { peer: "1", counter: 0 }, len: 10 }]
		* });
		* ```
		* @param {ExportMode} mode
		* @returns {Uint8Array}
		*/
		export(mode) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_export(retptr, this.__wbg_ptr, addHeapObject(mode));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
				if (getDataViewMemory0().getInt32(retptr + 12, true)) throw takeObject(r2);
				var v1 = getArrayU8FromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 1, 1);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Import snapshot or updates into current doc.
		*
		* Note:
		* - Updates within the current version will be ignored
		* - Updates with missing dependencies will be pending until the dependencies are received
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* // get all updates of the doc
		* const updates = doc.export({ mode: "update" });
		* const snapshot = doc.export({ mode: "snapshot" });
		* const doc2 = new LoroDoc();
		* // import snapshot
		* doc2.import(snapshot);
		* // or import updates
		* doc2.import(updates);
		* ```
		* @param {Uint8Array} update_or_snapshot
		* @returns {ImportStatus}
		*/
		import(update_or_snapshot) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArray8ToWasm0(update_or_snapshot, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorodoc_import(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Creates a new LoroDoc at a specified version (Frontiers)
		*
		* The created doc will only contain the history before the specified frontiers.
		* @param {({ peer: PeerID, counter: number })[]} frontiers
		* @returns {LoroDoc}
		*/
		forkAt(frontiers) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArrayJsValueToWasm0(frontiers, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorodoc_forkAt(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroDoc.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get a LoroMap by container id
		*
		* The object returned is a new js object each time because it need to cross
		* the WASM boundary.
		*
		* If the container does not exist, an error will be thrown.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* ```
		* @param {ContainerID | string} cid
		* @returns {LoroMap}
		*/
		getMap(cid) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getMap(retptr, this.__wbg_ptr, addBorrowedObject(cid));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroMap.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Get the number of ops in the oplog.
		* @returns {number}
		*/
		opCount() {
			return wasm.lorodoc_opCount(this.__wbg_ptr) >>> 0;
		}
		/**
		* Peer ID of the current writer.
		* @returns {bigint}
		*/
		get peerId() {
			const ret = wasm.lorodoc_peerId(this.__wbg_ptr);
			return BigInt.asUintN(64, ret);
		}
		/**
		* Get the json format of the entire document state.
		*
		* Unlike `getShallowValue()` which returns container IDs as strings,
		* `toJSON()` recursively resolves all containers to their actual values.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText, LoroMap } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, "Hello");
		* const text = list.insertContainer(0, new LoroText());
		* text.insert(0, "Hello");
		* const map = list.insertContainer(1, new LoroMap());
		* map.set("foo", "bar");
		* console.log(doc.toJSON());
		* // {"list": ["Hello", {"foo": "bar"}]}
		* ```
		* @returns {any}
		*/
		toJSON() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_toJSON(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the version vector of the current document state.
		*
		* If you checkout to a specific version, the version vector will change.
		* @returns {VersionVector}
		*/
		version() {
			const ret = wasm.lorodoc_version(this.__wbg_ptr);
			return VersionVector.__wrap(ret);
		}
		/**
		* Checkout the `DocState` to a specific version.
		*
		* > The document becomes detached during a `checkout` operation.
		* > Being `detached` implies that the `DocState` is not synchronized with the latest version of the `OpLog`.
		* > In a detached state, the document is not editable, and any `import` operations will be
		* > recorded in the `OpLog` without being applied to the `DocState`.
		*
		* You should call `attach` to attach the `DocState` to the latest version of `OpLog`.
		*
		* @param frontiers - the specific frontiers
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* const frontiers = doc.frontiers();
		* text.insert(0, "Hello World!");
		* doc.checkout(frontiers);
		* console.log(doc.toJSON()); // {"text": ""}
		* ```
		* @param {({ peer: PeerID, counter: number })[]} frontiers
		*/
		checkout(frontiers) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArrayJsValueToWasm0(frontiers, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorodoc_checkout(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get a LoroList by container id
		*
		* The object returned is a new js object each time because it need to cross
		* the WASM boundary.
		*
		* If the container does not exist, an error will be thrown.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* ```
		* @param {ContainerID | string} cid
		* @returns {LoroList}
		*/
		getList(cid) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getList(retptr, this.__wbg_ptr, addBorrowedObject(cid));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroList.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Get a LoroText by container id.
		*
		* The object returned is a new js object each time because it need to cross
		* the WASM boundary.
		*
		* If the container does not exist, an error will be thrown.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* ```
		* @param {ContainerID | string} cid
		* @returns {LoroText}
		*/
		getText(cid) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getText(retptr, this.__wbg_ptr, addBorrowedObject(cid));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroText.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Get a LoroTree by container id
		*
		* The object returned is a new js object each time because it need to cross
		* the WASM boundary.
		*
		* If the container does not exist, an error will be thrown.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const tree = doc.getTree("tree");
		* ```
		* @param {ContainerID | string} cid
		* @returns {LoroTree}
		*/
		getTree(cid) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_getTree(retptr, this.__wbg_ptr, addBorrowedObject(cid));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroTree.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Get the [frontiers](https://loro.dev/docs/advanced/version_deep_dive) of the current document state.
		*
		* If you checkout to a specific version, this value will change.
		* @returns {{ peer: PeerID, counter: number }[]}
		*/
		frontiers() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorodoc_frontiers(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Evaluate JSONPath against a LoroDoc
		* @param {string} jsonpath
		* @returns {Array<any>}
		*/
		JSONPath(jsonpath) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(jsonpath, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorodoc_JSONPath(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Revert the document to the given frontiers.
		*
		* The doc will not become detached when using this method. Instead, it will generate a series
		* of operations to revert the document to the given version.
		*
		* @example
		* ```ts
		* const doc = new LoroDoc();
		* doc.setPeerId("1");
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* doc.commit();
		* doc.revertTo([{ peer: "1", counter: 1 }]);
		* expect(doc.getText("text").toString()).toBe("He");
		* ```
		* @param {({ peer: PeerID, counter: number })[]} frontiers
		*/
		revertTo(frontiers) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArrayJsValueToWasm0(frontiers, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorodoc_revertTo(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Subscribe to the changes of the loro document. The function will be called when the
		* transaction is committed and after importing updates/snapshot from remote.
		*
		* Returns a subscription callback, which can be used to unsubscribe.
		*
		* The events will be emitted after a transaction is committed. A transaction is committed when:
		*
		* - `doc.commit()` is called.
		* - `doc.export(mode)` is called.
		* - `doc.import(data)` is called.
		* - `doc.checkout(version)` is called.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* const sub = doc.subscribe((event)=>{
		*     console.log(event);
		* });
		* text.insert(0, "Hello");
		* // the events will be emitted when `commit()` is called.
		* doc.commit();
		* // unsubscribe
		* sub();
		* ```
		* @param {Function} f
		* @returns {any}
		*/
		subscribe(f) {
			return takeObject(wasm.lorodoc_subscribe(this.__wbg_ptr, addHeapObject(f)));
		}
	};
	var LoroListFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_lorolist_free(ptr >>> 0, 1));
	/**
	* The handler of a list container.
	*
	* Learn more at https://loro.dev/docs/tutorial/list
	*/
	var LoroList = class LoroList {
		static __wrap(ptr) {
			ptr = ptr >>> 0;
			const obj = Object.create(LoroList.prototype);
			obj.__wbg_ptr = ptr;
			LoroListFinalization.register(obj, obj.__wbg_ptr, obj);
			return obj;
		}
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			LoroListFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_lorolist_free(ptr, 0);
		}
		/**
		* Whether the container is attached to a document.
		*
		* If it's detached, the operations on the container will not be persisted.
		* @returns {boolean}
		*/
		isAttached() {
			return wasm.lorolist_isAttached(this.__wbg_ptr) !== 0;
		}
		/**
		* Get the attached container associated with this.
		*
		* Returns an attached `Container` that equals to this or created by this, otherwise `undefined`.
		* @returns {LoroList | undefined}
		*/
		getAttached() {
			return takeObject(wasm.lorolist_getAttached(this.__wbg_ptr));
		}
		/**
		* @param {Container} child
		* @returns {Container}
		*/
		pushContainer(child) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorolist_pushContainer(retptr, this.__wbg_ptr, addHeapObject(child));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Insert a container at the index.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* const text = list.insertContainer(1, new LoroText());
		* text.insert(0, "Hello");
		* console.log(list.toJSON());  // [100, "Hello"];
		* ```
		* @param {number} index
		* @param {Container} child
		* @returns {Container}
		*/
		insertContainer(index, child) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorolist_insertContainer(retptr, this.__wbg_ptr, index, addHeapObject(child));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the shallow value of the list.
		*
		* Unlike `toJSON()` which recursively resolves all containers to their values,
		* `getShallowValue()` returns container IDs as strings for any nested containers.
		*
		* ```js
		* const doc = new LoroDoc();
		* doc.setPeerId("1");
		* const list = doc.getList("list");
		* list.insert(0, 1);
		* list.insert(1, "two");
		* const subList = list.insertContainer(2, new LoroList());
		* subList.insert(0, "sub");
		* list.getShallowValue(); // [1, "two", "cid:2@1:List"]
		* list.toJSON(); // [1, "two", ["sub"]]
		* ```
		* @returns {Value[]}
		*/
		getShallowValue() {
			return takeObject(wasm.lorolist_getShallowValue(this.__wbg_ptr));
		}
		/**
		* Get the id of this container.
		* @returns {ContainerID}
		*/
		get id() {
			return takeObject(wasm.lorolist_id(this.__wbg_ptr));
		}
		/**
		* Get the value at the index. If the value is a container, the corresponding handler will be returned.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* console.log(list.get(0));  // 100
		* console.log(list.get(1));  // undefined
		* ```
		* @param {number} index
		* @returns {Value | Container | undefined}
		*/
		get(index) {
			return takeObject(wasm.lorolist_get(this.__wbg_ptr, index));
		}
		/**
		* Create a new detached LoroList (not attached to any LoroDoc).
		*
		* The edits on a detached container will not be persisted.
		* To attach the container to the document, please insert it into an attached container.
		*/
		constructor() {
			const ret = wasm.lorolist_new();
			this.__wbg_ptr = ret >>> 0;
			LoroListFinalization.register(this, this.__wbg_ptr, this);
			return this;
		}
		/**
		* Pop a value from the end of the list.
		* @returns {Value | undefined}
		*/
		pop() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorolist_pop(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* "List"
		* @returns {'List'}
		*/
		kind() {
			return takeObject(wasm.lorolist_kind(this.__wbg_ptr));
		}
		/**
		* Push a value to the end of the list.
		* @param {Value} value
		*/
		push(value) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorolist_push(retptr, this.__wbg_ptr, addHeapObject(value));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Delete all elements in the list.
		*/
		clear() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorolist_clear(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Delete elements from index to index + len.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* list.delete(0, 1);
		* console.log(list.value);  // []
		* ```
		* @param {number} index
		* @param {number} len
		*/
		delete(index, len) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorolist_delete(retptr, this.__wbg_ptr, index, len);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Insert a value at index.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* list.insert(1, "foo");
		* list.insert(2, true);
		* console.log(list.value);  // [100, "foo", true];
		* ```
		* @param {number} index
		* @param {Value} value
		*/
		insert(index, value) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorolist_insert(retptr, this.__wbg_ptr, index, addHeapObject(value));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the length of list.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* list.insert(1, "foo");
		* list.insert(2, true);
		* console.log(list.length);  // 3
		* ```
		* @returns {number}
		*/
		get length() {
			return wasm.lorolist_length(this.__wbg_ptr) >>> 0;
		}
		/**
		* Get the parent container.
		*
		* - The parent container of the root tree is `undefined`.
		* - The object returned is a new js object each time because it need to cross
		*   the WASM boundary.
		* @returns {Container | undefined}
		*/
		parent() {
			return takeObject(wasm.lorolist_parent(this.__wbg_ptr));
		}
		/**
		* @param {number} pos
		* @returns {{ peer: PeerID, counter: number } | undefined}
		*/
		getIdAt(pos) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorolist_getIdAt(retptr, this.__wbg_ptr, pos);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get elements of the list. If the type of a element is a container, it will be
		* resolved recursively.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* const text = list.insertContainer(1, new LoroText());
		* text.insert(0, "Hello");
		* console.log(list.toJSON());  // [100, "Hello"];
		* ```
		* @returns {any}
		*/
		toJSON() {
			return takeObject(wasm.lorolist_toJSON(this.__wbg_ptr));
		}
		/**
		* Get elements of the list. If the value is a child container, the corresponding
		* `Container` will be returned.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* list.insert(1, "foo");
		* list.insert(2, true);
		* list.insertContainer(3, new LoroText());
		* console.log(list.value);  // [100, "foo", true, LoroText];
		* ```
		* @returns {(Value | Container)[]}
		*/
		toArray() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorolist_toArray(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the cursor at the position.
		*
		* - The first argument is the position .
		* - The second argument is the side: `-1` for left, `0` for middle, `1` for right.
		* @param {number} pos
		* @param {Side} side
		* @returns {Cursor | undefined}
		*/
		getCursor(pos, side) {
			const ret = wasm.lorolist_getCursor(this.__wbg_ptr, pos, addHeapObject(side));
			return ret === 0 ? void 0 : Cursor.__wrap(ret);
		}
		/**
		* Check if the container is deleted
		* @returns {boolean}
		*/
		isDeleted() {
			return wasm.lorolist_isDeleted(this.__wbg_ptr) !== 0;
		}
		/**
		* Subscribe to the changes of the list.
		*
		* Returns a subscription callback, which can be used to unsubscribe.
		*
		* The events will be emitted after a transaction is committed. A transaction is committed when:
		*
		* - `doc.commit()` is called.
		* - `doc.export(mode)` is called.
		* - `doc.import(data)` is called.
		* - `doc.checkout(version)` is called.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.subscribe((event)=>{
		*     console.log(event);
		* });
		* list.insert(0, 100);
		* doc.commit();
		* ```
		* @param {Function} f
		* @returns {any}
		*/
		subscribe(f) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorolist_subscribe(retptr, this.__wbg_ptr, addHeapObject(f));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
	};
	var LoroMapFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_loromap_free(ptr >>> 0, 1));
	/**
	* The handler of a map container.
	*
	* Learn more at https://loro.dev/docs/tutorial/map
	*
	* ## Mergeable child containers
	*
	* `ensureMergeable*` methods create deterministic child containers under a map
	* key. If two peers independently call the same method with the same parent
	* map, key, and container type, they get the same child container id and their
	* subsequent edits merge in that child.
	*
	* Loro activates a mergeable child by writing a specially constructed binary
	* marker value into the parent map slot. String values do not activate
	* mergeable children. If the key already holds a non-mergeable value,
	* `ensureMergeable*` returns an error and leaves the value unchanged.
	* Calling `ensureMergeable*` with a different container type at an existing
	* mergeable key is a deliberate kind change: the map slot activates the new
	* type, while the state of the other mergeable child remains preserved under
	* its deterministic id.
	*
	* Deleting the map key clears the ref and hides the mergeable child, but the
	* child's state is preserved. Calling the same `ensureMergeable*` method again
	* writes the ref back and resurfaces the preserved state.
	*/
	var LoroMap = class LoroMap {
		static __wrap(ptr) {
			ptr = ptr >>> 0;
			const obj = Object.create(LoroMap.prototype);
			obj.__wbg_ptr = ptr;
			LoroMapFinalization.register(obj, obj.__wbg_ptr, obj);
			return obj;
		}
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			LoroMapFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_loromap_free(ptr, 0);
		}
		/**
		* Whether the container is attached to a document.
		*
		* If it's detached, the operations on the container will not be persisted.
		* @returns {boolean}
		*/
		isAttached() {
			return wasm.loromap_isAttached(this.__wbg_ptr) !== 0;
		}
		/**
		* Get the attached container associated with this.
		*
		* Returns an attached `Container` that equals to this or created by this, otherwise `undefined`.
		* @returns {LoroMap | undefined}
		*/
		getAttached() {
			return takeObject(wasm.loromap_getAttached(this.__wbg_ptr));
		}
		/**
		* Get the peer id of the last editor on the given entry
		* @param {string} key
		* @returns {PeerID | undefined}
		*/
		getLastEditor(key) {
			const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			return takeObject(wasm.loromap_getLastEditor(this.__wbg_ptr, ptr0, len0));
		}
		/**
		* Set the key with a regular child container.
		*
		* The inserted child receives a regular op-created container id. Use this
		* for replacement semantics or when each creation should produce a distinct
		* child. Use `ensureMergeable*` when peers may lazily initialize the same
		* logical child under a map key.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText, LoroList } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* map.set("foo", "bar");
		* const text = map.setContainer("text", new LoroText());
		* const list = map.setContainer("list", new LoroList());
		* ```
		* @param {string} key
		* @param {Container} child
		* @returns {Container}
		*/
		setContainer(key, child) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.loromap_setContainer(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(child));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the shallow value of the map.
		*
		* Unlike `toJSON()` which recursively resolves all containers to their values,
		* `getShallowValue()` returns container IDs as strings for any nested containers.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* doc.setPeerId("1");
		* const map = doc.getMap("map");
		* map.set("key", "value");
		* const subText = map.setContainer("text", new LoroText());
		* subText.insert(0, "Hello");
		*
		* // Get shallow value - nested containers are represented by their IDs
		* console.log(map.getShallowValue());
		* // Output: { key: "value", text: "cid:1@1:Text" }
		*
		* // Get full value with nested containers resolved by `toJSON()`
		* console.log(map.toJSON());
		* // Output: { key: "value", text: "Hello" }
		* ```
		* @returns {Record<string, Value>}
		*/
		getShallowValue() {
			return takeObject(wasm.loromap_getShallowValue(this.__wbg_ptr));
		}
		/**
		* Ensure a mergeable Map exists under the given key and return it.
		*
		* If the map is detached, or if the key already holds a non-mergeable
		* value, this throws and leaves the value unchanged.
		*
		* Prefer to avoid very deep mergeable-map chains: mergeable cids encode
		* their flattened logical path, so cid size still grows with depth and
		* rides through every op/snapshot reference to it.
		* @param {string} key
		* @returns {LoroMap}
		*/
		ensureMergeableMap(key) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.loromap_ensureMergeableMap(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroMap.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Ensure a mergeable List exists under the given key and return it.
		*
		* If the map is detached, or if the key already holds a non-mergeable
		* value, this throws and leaves the value unchanged.
		* @param {string} key
		* @returns {LoroList}
		*/
		ensureMergeableList(key) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.loromap_ensureMergeableList(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroList.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Ensure a mergeable Text exists under the given key and return it.
		*
		* If the map is detached, or if the key already holds a non-mergeable
		* value, this throws and leaves the value unchanged.
		* @param {string} key
		* @returns {LoroText}
		*/
		ensureMergeableText(key) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.loromap_ensureMergeableText(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroText.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Ensure a mergeable Tree exists under the given key and return it.
		*
		* If the map is detached, or if the key already holds a non-mergeable
		* value, this throws and leaves the value unchanged.
		* @param {string} key
		* @returns {LoroTree}
		*/
		ensureMergeableTree(key) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.loromap_ensureMergeableTree(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroTree.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get or create a regular child container at the given key.
		*
		* @deprecated Use `ensureMergeable*` for lazy map-key child creation. This
		* method creates regular op-id children, so concurrent first creation at
		* the same key can fork child state and leave one branch hidden by map
		* conflict resolution. Use `setContainer` for regular replacement/attach
		* semantics.
		*
		* If the key is empty or `null`, this creates a regular child container.
		* If the key already holds a child of the same type, it returns that child.
		* If the key holds a scalar or a child of another type, it throws.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* const text = map.getOrCreateContainer("text", new LoroText());
		* text.insert(0, "legacy regular child");
		* ```
		* @param {string} key
		* @param {Container} child
		* @returns {Container}
		*/
		getOrCreateContainer(key, child) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.loromap_getOrCreateContainer(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(child));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Ensure a mergeable Counter exists under the given key and return it.
		*
		* If the map is detached, or if the key already holds a non-mergeable
		* value, this throws and leaves the value unchanged.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const counter = doc.getMap("state").ensureMergeableCounter("revision");
		* counter.increment(1);
		* ```
		* @param {string} key
		* @returns {LoroCounter}
		*/
		ensureMergeableCounter(key) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.loromap_ensureMergeableCounter(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroCounter.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Ensure a mergeable MovableList exists under the given key and return it.
		*
		* If the map is detached, or if the key already holds a non-mergeable
		* value, this throws and leaves the value unchanged.
		* @param {string} key
		* @returns {LoroMovableList}
		*/
		ensureMergeableMovableList(key) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.loromap_ensureMergeableMovableList(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroMovableList.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* The container id of this handler.
		* @returns {ContainerID}
		*/
		get id() {
			return takeObject(wasm.loromap_id(this.__wbg_ptr));
		}
		/**
		* Get the value of the key. If the value is a child container, the corresponding
		* `Container` will be returned.
		*
		* The object/value returned is a new js object/value each time because it need to cross
		* the WASM boundary.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* map.set("foo", "bar");
		* const bar = map.get("foo");
		* ```
		* @param {string} key
		* @returns {Value | Container | undefined}
		*/
		get(key) {
			const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			return takeObject(wasm.loromap_get(this.__wbg_ptr, ptr0, len0));
		}
		/**
		* Create a new detached LoroMap (not attached to any LoroDoc).
		*
		* The edits on a detached container will not be persisted.
		* To attach the container to the document, please insert it into an attached container.
		*/
		constructor() {
			const ret = wasm.loromap_new();
			this.__wbg_ptr = ret >>> 0;
			LoroMapFinalization.register(this, this.__wbg_ptr, this);
			return this;
		}
		/**
		* Get the keys of the map.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* map.set("foo", "bar");
		* map.set("baz", "bar");
		* const keys = map.keys(); // ["foo", "baz"]
		* ```
		* @returns {any[]}
		*/
		keys() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromap_keys(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* "Map"
		* @returns {'Map'}
		*/
		kind() {
			return takeObject(wasm.loromap_kind(this.__wbg_ptr));
		}
		/**
		* Get the size of the map.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* map.set("foo", "bar");
		* console.log(map.size);   // 1
		* ```
		* @returns {number}
		*/
		get size() {
			return wasm.loromap_size(this.__wbg_ptr) >>> 0;
		}
		/**
		* Delete all key-value pairs in the map.
		*/
		clear() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromap_clear(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Remove the key from the map.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* map.set("foo", "bar");
		* map.delete("foo");
		* ```
		* @param {string} key
		*/
		delete(key) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.loromap_delete(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Set the key with the value.
		*
		* If the value of the key is exist, the old value will be updated.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* map.set("foo", "bar");
		* map.set("foo", "baz");
		* ```
		* @param {string} key
		* @param {Value} value
		*/
		set(key, value) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.loromap_set(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(value));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the parent container.
		*
		* - The parent container of the root tree is `undefined`.
		* - The object returned is a new js object each time because it need to cross
		*   the WASM boundary.
		* @returns {Container | undefined}
		*/
		parent() {
			return takeObject(wasm.loromap_parent(this.__wbg_ptr));
		}
		/**
		* Get the values of the map. If the value is a child container, the corresponding
		* `Container` will be returned.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* map.set("foo", "bar");
		* map.set("baz", "bar");
		* const values = map.values(); // ["bar", "bar"]
		* ```
		* @returns {any[]}
		*/
		values() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromap_values(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the entries of the map. If the value is a child container, the corresponding
		* `Container` will be returned.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* map.set("foo", "bar");
		* map.set("baz", "bar");
		* const entries = map.entries(); // [["foo", "bar"], ["baz", "bar"]]
		* ```
		* @returns {([string, Value | Container])[]}
		*/
		entries() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromap_entries(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the keys and the values. If the type of value is a child container,
		* it will be resolved recursively.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* map.set("foo", "bar");
		* const text = map.setContainer("text", new LoroText());
		* text.insert(0, "Hello");
		* console.log(map.toJSON());  // {"foo": "bar", "text": "Hello"}
		* ```
		* @returns {any}
		*/
		toJSON() {
			return takeObject(wasm.loromap_toJSON(this.__wbg_ptr));
		}
		/**
		* Check if the container is deleted
		* @returns {boolean}
		*/
		isDeleted() {
			return wasm.loromap_isDeleted(this.__wbg_ptr) !== 0;
		}
		/**
		* Subscribe to the changes of the map.
		*
		* Returns a subscription callback, which can be used to unsubscribe.
		*
		* The events will be emitted after a transaction is committed. A transaction is committed when:
		*
		* - `doc.commit()` is called.
		* - `doc.export(mode)` is called.
		* - `doc.import(data)` is called.
		* - `doc.checkout(version)` is called.
		*
		* @param {Listener} f - Event listener
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const map = doc.getMap("map");
		* map.subscribe((event)=>{
		*     console.log(event);
		* });
		* map.set("foo", "bar");
		* doc.commit();
		* ```
		* @param {Function} f
		* @returns {any}
		*/
		subscribe(f) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromap_subscribe(retptr, this.__wbg_ptr, addHeapObject(f));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
	};
	var LoroMovableListFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_loromovablelist_free(ptr >>> 0, 1));
	/**
	* The handler of a list container.
	*
	* Learn more at https://loro.dev/docs/tutorial/list
	*/
	var LoroMovableList = class LoroMovableList {
		static __wrap(ptr) {
			ptr = ptr >>> 0;
			const obj = Object.create(LoroMovableList.prototype);
			obj.__wbg_ptr = ptr;
			LoroMovableListFinalization.register(obj, obj.__wbg_ptr, obj);
			return obj;
		}
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			LoroMovableListFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_loromovablelist_free(ptr, 0);
		}
		/**
		* Whether the container is attached to a document.
		*
		* If it's detached, the operations on the container will not be persisted.
		* @returns {boolean}
		*/
		isAttached() {
			return wasm.loromovablelist_isAttached(this.__wbg_ptr) !== 0;
		}
		/**
		* Get the creator of the list item at the given position.
		* @param {number} pos
		* @returns {PeerID | undefined}
		*/
		getCreatorAt(pos) {
			return takeObject(wasm.loromovablelist_getCreatorAt(this.__wbg_ptr, pos));
		}
		/**
		* Get the attached container associated with this.
		*
		* Returns an attached `Container` that equals to this or created by this, otherwise `undefined`.
		* @returns {LoroList | undefined}
		*/
		getAttached() {
			return takeObject(wasm.loromovablelist_getAttached(this.__wbg_ptr));
		}
		/**
		* Set the container at the given position.
		* @param {number} pos
		* @param {Container} child
		* @returns {Container}
		*/
		setContainer(pos, child) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_setContainer(retptr, this.__wbg_ptr, pos, addHeapObject(child));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the last mover of the list item at the given position.
		* @param {number} pos
		* @returns {PeerID | undefined}
		*/
		getLastMoverAt(pos) {
			return takeObject(wasm.loromovablelist_getLastMoverAt(this.__wbg_ptr, pos));
		}
		/**
		* Push a container to the end of the list.
		* @param {Container} child
		* @returns {Container}
		*/
		pushContainer(child) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_pushContainer(retptr, this.__wbg_ptr, addHeapObject(child));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the last editor of the list item at the given position.
		* @param {number} pos
		* @returns {PeerID | undefined}
		*/
		getLastEditorAt(pos) {
			return takeObject(wasm.loromovablelist_getLastEditorAt(this.__wbg_ptr, pos));
		}
		/**
		* Insert a container at the index.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* const text = list.insertContainer(1, new LoroText());
		* text.insert(0, "Hello");
		* console.log(list.toJSON());  // [100, "Hello"];
		* ```
		* @param {number} index
		* @param {Container} child
		* @returns {Container}
		*/
		insertContainer(index, child) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_insertContainer(retptr, this.__wbg_ptr, index, addHeapObject(child));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the shallow value of the movable list.
		*
		* Unlike `toJSON()` which recursively resolves all containers to their values,
		* `getShallowValue()` returns container IDs as strings for any nested containers.
		*
		* ```js
		* const doc = new LoroDoc();
		* doc.setPeerId("1");
		* const list = doc.getMovableList("list");
		* list.insert(0, 1);
		* list.insert(1, "two");
		* const subList = list.insertContainer(2, new LoroList());
		* subList.insert(0, "sub");
		* list.getShallowValue(); // [1, "two", "cid:2@1:List"]
		* list.toJSON(); // [1, "two", ["sub"]]
		* ```
		* @returns {Value[]}
		*/
		getShallowValue() {
			return takeObject(wasm.loromovablelist_getShallowValue(this.__wbg_ptr));
		}
		/**
		* Get the id of this container.
		* @returns {ContainerID}
		*/
		get id() {
			return takeObject(wasm.loromovablelist_id(this.__wbg_ptr));
		}
		/**
		* Get the value at the index. If the value is a container, the corresponding handler will be returned.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* console.log(list.get(0));  // 100
		* console.log(list.get(1));  // undefined
		* ```
		* @param {number} index
		* @returns {Value | Container | undefined}
		*/
		get(index) {
			return takeObject(wasm.loromovablelist_get(this.__wbg_ptr, index));
		}
		/**
		* Move the element from `from` to `to`.
		*
		* The new position of the element will be `to`.
		* Move the element from `from` to `to`.
		*
		* The new position of the element will be `to`. This method is optimized to prevent redundant
		* operations that might occur with a naive remove and insert approach. Specifically, it avoids
		* creating surplus values in the list, unlike a delete followed by an insert, which can lead to
		* additional values in cases of concurrent edits. This ensures more efficient and accurate
		* operations in a MovableList.
		* @param {number} from
		* @param {number} to
		*/
		move(from, to) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_move(retptr, this.__wbg_ptr, from, to);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Create a new detached LoroMovableList (not attached to any LoroDoc).
		*
		* The edits on a detached container will not be persisted.
		* To attach the container to the document, please insert it into an attached container.
		*/
		constructor() {
			const ret = wasm.loromovablelist_new();
			this.__wbg_ptr = ret >>> 0;
			LoroMovableListFinalization.register(this, this.__wbg_ptr, this);
			return this;
		}
		/**
		* Pop a value from the end of the list.
		* @returns {Value | undefined}
		*/
		pop() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_pop(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Set the value at the given position.
		*
		* It's different from `delete` + `insert` that it will replace the value at the position.
		*
		* For example, if you have a list `[1, 2, 3]`, and you call `set(1, 100)`, the list will be `[1, 100, 3]`.
		* If concurrently someone call `set(1, 200)`, the list will be `[1, 200, 3]` or `[1, 100, 3]`.
		*
		* But if you use `delete` + `insert` to simulate the set operation, they may create redundant operations
		* and the final result will be `[1, 100, 200, 3]` or `[1, 200, 100, 3]`.
		* @param {number} pos
		* @param {Value} value
		*/
		set(pos, value) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_set(retptr, this.__wbg_ptr, pos, addHeapObject(value));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* "MovableList"
		* @returns {'MovableList'}
		*/
		kind() {
			return takeObject(wasm.loromovablelist_kind(this.__wbg_ptr));
		}
		/**
		* Push a value to the end of the list.
		* @param {Value} value
		*/
		push(value) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_push(retptr, this.__wbg_ptr, addHeapObject(value));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Delete all elements in the list.
		*/
		clear() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_clear(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Delete elements from index to index + len.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* list.delete(0, 1);
		* console.log(list.value);  // []
		* ```
		* @param {number} index
		* @param {number} len
		*/
		delete(index, len) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_delete(retptr, this.__wbg_ptr, index, len);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Insert a value at index.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* list.insert(1, "foo");
		* list.insert(2, true);
		* console.log(list.value);  // [100, "foo", true];
		* ```
		* @param {number} index
		* @param {Value} value
		*/
		insert(index, value) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_insert(retptr, this.__wbg_ptr, index, addHeapObject(value));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the length of list.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* list.insert(1, "foo");
		* list.insert(2, true);
		* console.log(list.length);  // 3
		* ```
		* @returns {number}
		*/
		get length() {
			return wasm.loromovablelist_length(this.__wbg_ptr) >>> 0;
		}
		/**
		* Get the parent container.
		*
		* - The parent container of the root tree is `undefined`.
		* - The object returned is a new js object each time because it need to cross
		*   the WASM boundary.
		* @returns {Container | undefined}
		*/
		parent() {
			return takeObject(wasm.loromovablelist_parent(this.__wbg_ptr));
		}
		/**
		* Get elements of the list. If the type of a element is a container, it will be
		* resolved recursively.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* const text = list.insertContainer(1, new LoroText());
		* text.insert(0, "Hello");
		* console.log(list.toJSON());  // [100, "Hello"];
		* ```
		* @returns {any}
		*/
		toJSON() {
			return takeObject(wasm.loromovablelist_toJSON(this.__wbg_ptr));
		}
		/**
		* Get elements of the list. If the value is a child container, the corresponding
		* `Container` will be returned.
		*
		* @example
		* ```ts
		* import { LoroDoc, LoroText } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.insert(0, 100);
		* list.insert(1, "foo");
		* list.insert(2, true);
		* list.insertContainer(3, new LoroText());
		* console.log(list.value);  // [100, "foo", true, LoroText];
		* ```
		* @returns {(Value | Container)[]}
		*/
		toArray() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_toArray(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the cursor of the container.
		* @param {number} pos
		* @param {Side} side
		* @returns {Cursor | undefined}
		*/
		getCursor(pos, side) {
			const ret = wasm.loromovablelist_getCursor(this.__wbg_ptr, pos, addHeapObject(side));
			return ret === 0 ? void 0 : Cursor.__wrap(ret);
		}
		/**
		* Check if the container is deleted
		* @returns {boolean}
		*/
		isDeleted() {
			return wasm.loromovablelist_isDeleted(this.__wbg_ptr) !== 0;
		}
		/**
		* Subscribe to the changes of the list.
		*
		* Returns a subscription callback, which can be used to unsubscribe.
		*
		* The events will be emitted after a transaction is committed. A transaction is committed when:
		*
		* - `doc.commit()` is called.
		* - `doc.export(mode)` is called.
		* - `doc.import(data)` is called.
		* - `doc.checkout(version)` is called.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const list = doc.getList("list");
		* list.subscribe((event)=>{
		*     console.log(event);
		* });
		* list.insert(0, 100);
		* doc.commit();
		* ```
		* @param {Function} f
		* @returns {any}
		*/
		subscribe(f) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.loromovablelist_subscribe(retptr, this.__wbg_ptr, addHeapObject(f));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
	};
	var LoroTextFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_lorotext_free(ptr >>> 0, 1));
	/**
	* The handler of a text container. It supports rich text CRDT.
	*
	* Learn more at https://loro.dev/docs/tutorial/text
	*/
	var LoroText = class LoroText {
		static __wrap(ptr) {
			ptr = ptr >>> 0;
			const obj = Object.create(LoroText.prototype);
			obj.__wbg_ptr = ptr;
			LoroTextFinalization.register(obj, obj.__wbg_ptr, obj);
			return obj;
		}
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			LoroTextFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_lorotext_free(ptr, 0);
		}
		/**
		* Change the state of this text by delta.
		*
		* If a delta item is `insert`, it should include all the attributes of the inserted text.
		* Loro's rich text CRDT may make the inserted text inherit some styles when you use
		* `insert` method directly. However, when you use `applyDelta` if some attributes are
		* inherited from CRDT but not included in the delta, they will be removed.
		*
		* Another special property of `applyDelta` is if you format an attribute for ranges out of
		* the text length, Loro will insert new lines to fill the gap first. It's useful when you
		* build the binding between Loro and rich text editors like Quill, which might assume there
		* is always a newline at the end of the text implicitly.
		*
		* @example
		* ```ts
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* doc.configTextStyle({bold: {expand: "after"}});
		* text.insert(0, "Hello World!");
		* text.mark({ start: 0, end: 5 }, "bold", true);
		* const delta = text.toDelta();
		* const text2 = doc.getText("text2");
		* text2.applyDelta(delta);
		* expect(text2.toDelta()).toStrictEqual(delta);
		* ```
		* @param {Delta<string>[]} delta
		*/
		applyDelta(delta) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_applyDelta(retptr, this.__wbg_ptr, addHeapObject(delta));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Convert a position between coordinate systems.
		*
		* Supported values: `"unicode"`, `"utf16"`, `"utf8"`.
		*
		* Returns `undefined` when out of bounds or unsupported.
		* @param {number} index
		* @param {string} from
		* @param {string} to
		* @returns {any}
		*/
		convertPos(index, from, to) {
			const ptr0 = passStringToWasm0(from, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			const ptr1 = passStringToWasm0(to, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len1 = WASM_VECTOR_LEN;
			return takeObject(wasm.lorotext_convertPos(this.__wbg_ptr, index, ptr0, len0, ptr1, len1));
		}
		/**
		* Delete elements from index to utf-8 index + len
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insertUtf8(0, "Hello");
		* text.deleteUtf8(1, 3);
		* const s = text.toString();
		* console.log(s); // "Ho"
		* ```
		* @param {number} index
		* @param {number} len
		*/
		deleteUtf8(index, len) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_deleteUtf8(retptr, this.__wbg_ptr, index, len);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the editor of the text at the given position.
		* @param {number} pos
		* @returns {PeerID | undefined}
		*/
		getEditorOf(pos) {
			return takeObject(wasm.lorotext_getEditorOf(this.__wbg_ptr, pos));
		}
		/**
		* Insert some string at utf-8 index.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insertUtf8(0, "Hello");
		* ```
		* @param {number} index
		* @param {string} content
		*/
		insertUtf8(index, content) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorotext_insertUtf8(retptr, this.__wbg_ptr, index, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Whether the container is attached to a LoroDoc.
		*
		* If it's detached, the operations on the container will not be persisted.
		* @returns {boolean}
		*/
		isAttached() {
			return wasm.lorotext_isAttached(this.__wbg_ptr) !== 0;
		}
		/**
		* Get the rich text delta in the given range (utf-16 index).
		* @param {number} start
		* @param {number} end
		* @returns {Delta<string>[]}
		*/
		sliceDelta(start, end) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_sliceDelta(retptr, this.__wbg_ptr, start, end);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the attached container associated with this.
		*
		* Returns an attached `Container` that is equal to this or created by this; otherwise, it returns `undefined`.
		* @returns {LoroText | undefined}
		*/
		getAttached() {
			return takeObject(wasm.lorotext_getAttached(this.__wbg_ptr));
		}
		/**
		* Update the current text to the target text, the difference is calculated line by line.
		*
		* It uses Myers' diff algorithm to compute the optimal difference.
		* @param {string} text
		* @param {any} options
		*/
		updateByLine(text, options) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorotext_updateByLine(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(options));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the rich text delta in the given range (utf-8 index).
		* @param {number} start
		* @param {number} end
		* @returns {Delta<string>[]}
		*/
		sliceDeltaUtf8(start, end) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_sliceDeltaUtf8(retptr, this.__wbg_ptr, start, end);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the shallow value of the text. This equals to `text.toString()`.
		* @returns {string}
		*/
		getShallowValue() {
			let deferred1_0;
			let deferred1_1;
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_getShallowValue(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				deferred1_0 = r0;
				deferred1_1 = r1;
				return getStringFromWasm0(r0, r1);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
			}
		}
		/**
		* Get the container id of the text.
		* @returns {ContainerID}
		*/
		get id() {
			return takeObject(wasm.lorotext_id(this.__wbg_ptr));
		}
		/**
		* Create a new detached LoroText (not attached to any LoroDoc).
		*
		* The edits on a detached container will not be persisted.
		* To attach the container to the document, please insert it into an attached container.
		*/
		constructor() {
			const ret = wasm.lorotext_new();
			this.__wbg_ptr = ret >>> 0;
			LoroTextFinalization.register(this, this.__wbg_ptr, this);
			return this;
		}
		/**
		* Iterate each text span(internal storage unit)
		*
		* The callback function will be called for each span in the text.
		* If the callback returns `false`, the iteration will stop.
		*
		* The current text chunks are snapshotted before callbacks run, so the callback
		* may read or mutate the document without re-entering internal state locks.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* text.iter((str) => (console.log(str), true));
		* ```
		* @param {(string) => boolean} callback
		*/
		iter(callback) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_iter(retptr, this.__wbg_ptr, addHeapObject(callback));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* "Text"
		* @returns {'Text'}
		*/
		kind() {
			return takeObject(wasm.lorotext_kind(this.__wbg_ptr));
		}
		/**
		* Mark a range of text with a key and a value (utf-16 index).
		*
		* > You should call `configTextStyle` before using `mark` and `unmark`.
		*
		* You can use it to create a highlight, make a range of text bold, or add a link to a range of text.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* doc.configTextStyle({bold: {expand: "after"}});
		* const text = doc.getText("text");
		* text.insert(0, "Hello World!");
		* text.mark({ start: 0, end: 5 }, "bold", true);
		* ```
		* @param {{ start: number, end: number }} range
		* @param {string} key
		* @param {any} value
		*/
		mark(range, key, value) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorotext_mark(retptr, this.__wbg_ptr, addHeapObject(range), ptr0, len0, addHeapObject(value));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Push a string to the end of the text.
		* @param {string} s
		*/
		push(s) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorotext_push(retptr, this.__wbg_ptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get a string slice (utf-16 index).
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* text.slice(0, 2); // "He"
		* ```
		* @param {number} start_index
		* @param {number} end_index
		* @returns {string}
		*/
		slice(start_index, end_index) {
			let deferred2_0;
			let deferred2_1;
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_slice(retptr, this.__wbg_ptr, start_index, end_index);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
				var r3 = getDataViewMemory0().getInt32(retptr + 12, true);
				var ptr1 = r0;
				var len1 = r1;
				if (r3) {
					ptr1 = 0;
					len1 = 0;
					throw takeObject(r2);
				}
				deferred2_0 = ptr1;
				deferred2_1 = len1;
				return getStringFromWasm0(ptr1, len1);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
			}
		}
		/**
		* Delete elements from index to index + len (utf-16 index).
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* text.delete(1, 3);
		* const s = text.toString();
		* console.log(s); // "Ho"
		* ```
		* @param {number} index
		* @param {number} len
		*/
		delete(index, len) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_delete(retptr, this.__wbg_ptr, index, len);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Insert the string at the given index (utf-16 index).
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* ```
		* @param {number} index
		* @param {string} content
		*/
		insert(index, content) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorotext_insert(retptr, this.__wbg_ptr, index, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the length of text (utf-16 length).
		* @returns {number}
		*/
		get length() {
			return wasm.lorotext_length(this.__wbg_ptr) >>> 0;
		}
		/**
		* Get the parent container.
		*
		* - The parent of the root is `undefined`.
		* - The object returned is a new js object each time because it need to cross
		*   the WASM boundary.
		* @returns {Container | undefined}
		*/
		parent() {
			return takeObject(wasm.lorotext_parent(this.__wbg_ptr));
		}
		/**
		* Delete and return the string at the given range and insert a string at the same position (utf-16 index).
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* text.splice(2, 3, "llo"); // "llo"
		* ```
		* @param {number} pos
		* @param {number} len
		* @param {string} s
		* @returns {string}
		*/
		splice(pos, len, s) {
			let deferred3_0;
			let deferred3_1;
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorotext_splice(retptr, this.__wbg_ptr, pos, len, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
				var r3 = getDataViewMemory0().getInt32(retptr + 12, true);
				var ptr2 = r0;
				var len2 = r1;
				if (r3) {
					ptr2 = 0;
					len2 = 0;
					throw takeObject(r2);
				}
				deferred3_0 = ptr2;
				deferred3_1 = len2;
				return getStringFromWasm0(ptr2, len2);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
			}
		}
		/**
		* Unmark a range of text with a key and a value (utf-16 index).
		*
		* > You should call `configTextStyle` before using `mark` and `unmark`.
		*
		* You can use it to remove highlights, bolds or links
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* doc.configTextStyle({bold: {expand: "after"}});
		* const text = doc.getText("text");
		* text.insert(0, "Hello World!");
		* text.mark({ start: 0, end: 5 }, "bold", true);
		* text.unmark({ start: 0, end: 5 }, "bold");
		* ```
		* @param {{ start: number, end: number }} range
		* @param {string} key
		*/
		unmark(range, key) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorotext_unmark(retptr, this.__wbg_ptr, addHeapObject(range), ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Update the current text to the target text.
		*
		* It will calculate the minimal difference and apply it to the current text.
		* It uses Myers' diff algorithm to compute the optimal difference.
		*
		* This could take a long time for large texts (e.g. > 50_000 characters).
		* In that case, you should use `updateByLine` instead.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* text.update("Hello World");
		* console.log(text.toString()); // "Hello World"
		* ```
		* @param {string} text
		* @param {any} options
		*/
		update(text, options) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.lorotext_update(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(options));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the character at the given position (utf-16 index).
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* text.insert(0, "Hello");
		* text.charAt(0); // "H"
		* ```
		* @param {number} pos
		* @returns {string}
		*/
		charAt(pos) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_charAt(retptr, this.__wbg_ptr, pos);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return String.fromCodePoint(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the JSON representation of the text.
		* @returns {any}
		*/
		toJSON() {
			return takeObject(wasm.lorotext_toJSON(this.__wbg_ptr));
		}
		/**
		* Get the text in [Delta](https://quilljs.com/docs/delta/) format.
		*
		* The returned value will include the rich text information.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const text = doc.getText("text");
		* doc.configTextStyle({bold: {expand: "after"}});
		* text.insert(0, "Hello World!");
		* text.mark({ start: 0, end: 5 }, "bold", true);
		* console.log(text.toDelta());  // [ { insert: 'Hello', attributes: { bold: true } } ]
		* ```
		* @returns {Delta<string>[]}
		*/
		toDelta() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_toDelta(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the cursor at the given position.
		*
		* - The first argument is the position (utf16-index).
		* - The second argument is the side: `-1` for left, `0` for middle, `1` for right.
		* @param {number} pos
		* @param {Side} side
		* @returns {Cursor | undefined}
		*/
		getCursor(pos, side) {
			const ret = wasm.lorotext_getCursor(this.__wbg_ptr, pos, addHeapObject(side));
			return ret === 0 ? void 0 : Cursor.__wrap(ret);
		}
		/**
		* Check if the container is deleted
		* @returns {boolean}
		*/
		isDeleted() {
			return wasm.lorotext_isDeleted(this.__wbg_ptr) !== 0;
		}
		/**
		* Subscribe to the changes of the text.
		*
		* The events will be emitted after a transaction is committed. A transaction is committed when:
		*
		* - `doc.commit()` is called.
		* - `doc.export(mode)` is called.
		* - `doc.import(data)` is called.
		* - `doc.checkout(version)` is called.
		*
		* returns a subscription callback, which can be used to unsubscribe.
		* @param {Function} f
		* @returns {any}
		*/
		subscribe(f) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_subscribe(retptr, this.__wbg_ptr, addHeapObject(f));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Convert the text to a string
		* @returns {string}
		*/
		toString() {
			let deferred1_0;
			let deferred1_1;
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotext_toString(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				deferred1_0 = r0;
				deferred1_1 = r1;
				return getStringFromWasm0(r0, r1);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
			}
		}
	};
	var LoroTreeFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_lorotree_free(ptr >>> 0, 1));
	/**
	* The handler of a tree(forest) container.
	*
	* Learn more at https://loro.dev/docs/tutorial/tree
	*/
	var LoroTree = class LoroTree {
		static __wrap(ptr) {
			ptr = ptr >>> 0;
			const obj = Object.create(LoroTree.prototype);
			obj.__wbg_ptr = ptr;
			LoroTreeFinalization.register(obj, obj.__wbg_ptr, obj);
			return obj;
		}
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			LoroTreeFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_lorotree_free(ptr, 0);
		}
		/**
		* Create a new tree node as the child of parent and return a `LoroTreeNode` instance.
		* If the parent is undefined, the tree node will be a root node.
		*
		* If the index is not provided, the new node will be appended to the end.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const tree = doc.getTree("tree");
		* const root = tree.createNode();
		* const node = tree.createNode(undefined, 0);
		*
		* //  undefined
		* //    /   \
		* // node  root
		* ```
		* @param {TreeID | undefined} parent
		* @param {number | null} [index]
		* @returns {LoroTreeNode}
		*/
		createNode(parent, index) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotree_createNode(retptr, this.__wbg_ptr, addBorrowedObject(parent), isLikeNone(index) ? 4294967297 : index >>> 0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroTreeNode.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Whether the container is attached to a document.
		*
		* If it's detached, the operations on the container will not be persisted.
		* @returns {boolean}
		*/
		isAttached() {
			return wasm.lorotree_isAttached(this.__wbg_ptr) !== 0;
		}
		/**
		* Get the attached container associated with this.
		*
		* Returns an attached `Container` that equals to this or created by this, otherwise `undefined`.
		* @returns {LoroTree | undefined}
		*/
		getAttached() {
			return takeObject(wasm.lorotree_getAttached(this.__wbg_ptr));
		}
		/**
		* Get LoroTreeNode by the TreeID.
		* @param {TreeID} target
		* @returns {LoroTreeNode | undefined}
		*/
		getNodeByID(target) {
			try {
				const ret = wasm.lorotree_getNodeByID(this.__wbg_ptr, addBorrowedObject(target));
				return ret === 0 ? void 0 : LoroTreeNode.__wrap(ret);
			} finally {
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Return `None` if the node is not exist, otherwise return `Some(true)` if the node is deleted.
		* @param {TreeID} target
		* @returns {boolean}
		*/
		isNodeDeleted(target) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotree_isNodeDeleted(retptr, this.__wbg_ptr, addBorrowedObject(target));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return r0 !== 0;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Get the shallow value of the tree.
		*
		* Unlike `toJSON()` which recursively resolves nested containers to their values,
		* `getShallowValue()` returns container IDs as strings for any nested containers.
		*
		* @example
		* ```ts
		* const doc = new LoroDoc();
		* doc.setPeerId("1");
		* const tree = doc.getTree("tree");
		* const root = tree.createNode();
		* root.data.set("name", "root");
		* const text = root.data.setContainer("content", new LoroText());
		* text.insert(0, "Hello");
		*
		* console.log(tree.getShallowValue());
		* // [{
		* //   id: "0@1",
		* //   parent: null,
		* //   index: 0,
		* //   fractional_index: "80",
		* //   meta: "cid:0@1:Map",
		* //   children: []
		* // }]
		*
		* console.log(tree.toJSON());
		* // [{
		* //   id: "0@1",
		* //   parent: null,
		* //   index: 0,
		* //   fractional_index: "80",
		* //   meta: {
		* //     name: "root",
		* //     content: "Hello"
		* //   },
		* //   children: []
		* // }]
		* ```
		* @returns {TreeNodeShallowValue[]}
		*/
		getShallowValue() {
			return takeObject(wasm.lorotree_getShallowValue(this.__wbg_ptr));
		}
		/**
		* Set whether to generate a fractional index for moving and creating.
		*
		* A fractional index can be used to determine the position of tree nodes among their siblings.
		*
		* The jitter is used to avoid conflicts when multiple users are creating a node at the same position.
		* A value of 0 is the default, which means no jitter; any value larger than 0 will enable jitter.
		*
		* Generally speaking, higher jitter value will increase the size of the operation
		* [Read more about it](https://www.loro.dev/blog/movable-tree#implementation-and-encoding-size)
		* @param {number} jitter
		*/
		enableFractionalIndex(jitter) {
			wasm.lorotree_enableFractionalIndex(this.__wbg_ptr, jitter);
		}
		/**
		* Disable the fractional index generation when you don't need the Tree's siblings to be sorted.
		* The fractional index will always be set to the same default value 0.
		*
		* After calling this, you cannot use `tree.moveTo()`, `tree.moveBefore()`, `tree.moveAfter()`,
		* and `tree.createAt()`.
		*/
		disableFractionalIndex() {
			wasm.lorotree_disableFractionalIndex(this.__wbg_ptr);
		}
		/**
		* Whether the tree enables the fractional index generation.
		* @returns {boolean}
		*/
		isFractionalIndexEnabled() {
			return wasm.lorotree_isFractionalIndexEnabled(this.__wbg_ptr) !== 0;
		}
		/**
		* Get the id of the container.
		* @returns {ContainerID}
		*/
		get id() {
			return takeObject(wasm.lorotree_id(this.__wbg_ptr));
		}
		/**
		* Move the target tree node to be a child of the parent.
		* It's not allowed that the target is an ancestor of the parent
		* or the target and the parent are the same node.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const tree = doc.getTree("tree");
		* const root = tree.createNode();
		* const node = root.createNode();
		* const node2 = node.createNode();
		* tree.move(node2.id, root.id);
		* // Error will be thrown if move operation creates a cycle
		* // tree.move(root.id, node.id);
		* ```
		* @param {TreeID} target
		* @param {TreeID | undefined} parent
		* @param {number | null} [index]
		*/
		move(target, parent, index) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotree_move(retptr, this.__wbg_ptr, addBorrowedObject(target), addBorrowedObject(parent), isLikeNone(index) ? 4294967297 : index >>> 0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				heap[stack_pointer++] = void 0;
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Create a new detached LoroTree (not attached to any LoroDoc).
		*
		* The edits on a detached container will not be persisted.
		* To attach the container to the document, please insert it into an attached container.
		*/
		constructor() {
			const ret = wasm.lorotree_new();
			this.__wbg_ptr = ret >>> 0;
			LoroTreeFinalization.register(this, this.__wbg_ptr, this);
			return this;
		}
		/**
		* "Tree"
		* @returns {'Tree'}
		*/
		kind() {
			return takeObject(wasm.lorotree_kind(this.__wbg_ptr));
		}
		/**
		* Get all tree nodes of the forest, including deleted nodes.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const tree = doc.getTree("tree");
		* const root = tree.createNode();
		* const node = root.createNode();
		* const node2 = node.createNode();
		* console.log(tree.nodes());
		* ```
		* @returns {LoroTreeNode[]}
		*/
		nodes() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotree_nodes(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the root nodes of the forest.
		* @returns {LoroTreeNode[]}
		*/
		roots() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotree_roots(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 4, 4);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Delete a tree node from the forest.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const tree = doc.getTree("tree");
		* const root = tree.createNode();
		* const node = root.createNode();
		* tree.delete(node.id);
		* ```
		* @param {TreeID} target
		*/
		delete(target) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotree_delete(retptr, this.__wbg_ptr, addBorrowedObject(target));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Get the parent container of the tree container.
		*
		* - The parent container of the root tree is `undefined`.
		* - The object returned is a new js object each time because it need to cross
		*   the WASM boundary.
		* @returns {Container | undefined}
		*/
		parent() {
			return takeObject(wasm.lorotree_parent(this.__wbg_ptr));
		}
		/**
		* Get the hierarchy array with metadata of the forest.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const tree = doc.getTree("tree");
		* const root = tree.createNode();
		* root.data.set("color", "red");
		* // [ { id: '0@F2462C4159C4C8D1', parent: null, meta: { color: 'red' }, children: [] } ]
		* console.log(tree.toJSON());
		* ```
		* @returns {any}
		*/
		toJSON() {
			return takeObject(wasm.lorotree_toJSON(this.__wbg_ptr));
		}
		/**
		* Return `true` if the tree contains the TreeID, include deleted node.
		* @param {TreeID} target
		* @returns {boolean}
		*/
		has(target) {
			try {
				return wasm.lorotree_has(this.__wbg_ptr, addBorrowedObject(target)) !== 0;
			} finally {
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Get the hierarchy array of the forest.
		*
		* Note: the metadata will be not resolved. So if you don't only care about hierarchy
		* but also the metadata, you should use `toJson()`.
		* @returns {Array<any>}
		*/
		toArray() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotree_toArray(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the flat array of the forest. If `with_deleted` is true, the deleted nodes will be included.
		* @param {{ withDeleted: boolean }} options
		* @returns {Array<any>}
		*/
		getNodes(options) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotree_getNodes(retptr, this.__wbg_ptr, addHeapObject(options));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Check if the container is deleted
		* @returns {boolean}
		*/
		isDeleted() {
			return wasm.lorotree_isDeleted(this.__wbg_ptr) !== 0;
		}
		/**
		* Subscribe to the changes of the tree.
		*
		* Returns a subscription callback, which can be used to unsubscribe.
		*
		* Trees have three types of events: `create`, `delete`, and `move`.
		* - `create`: Creates a new node with its `target` TreeID. If `parent` is undefined,
		*             a root node is created; otherwise, a child node of `parent` is created.
		*             If the node being created was previously deleted and has archived child nodes,
		*             create events for these child nodes will also be received.
		* - `delete`: Deletes the target node. The structure and state of the target node and
		*             its child nodes are archived, and delete events for the child nodes will not be received.
		* - `move`:   Moves the target node. If `parent` is undefined, the target node becomes a root node;
		*             otherwise, it becomes a child node of `parent`.
		*
		* If a tree container is subscribed, the event of metadata changes will also be received as a MapDiff.
		* And event's `path` will end with `TreeID`.
		*
		* The events will be emitted after a transaction is committed. A transaction is committed when:
		*
		* - `doc.commit()` is called.
		* - `doc.export(mode)` is called.
		* - `doc.import(data)` is called.
		* - `doc.checkout(version)` is called.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const tree = doc.getTree("tree");
		* tree.subscribe((event)=>{
		*     // event.type: "create" | "delete" | "move"
		* });
		* const root = tree.createNode();
		* const node = root.createNode();
		* doc.commit();
		* ```
		* @param {Function} f
		* @returns {any}
		*/
		subscribe(f) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotree_subscribe(retptr, this.__wbg_ptr, addHeapObject(f));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
	};
	var LoroTreeNodeFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_lorotreenode_free(ptr >>> 0, 1));
	/**
	* The handler of a tree node.
	*/
	var LoroTreeNode = class LoroTreeNode {
		static __wrap(ptr) {
			ptr = ptr >>> 0;
			const obj = Object.create(LoroTreeNode.prototype);
			obj.__wbg_ptr = ptr;
			LoroTreeNodeFinalization.register(obj, obj.__wbg_ptr, obj);
			return obj;
		}
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			LoroTreeNodeFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_lorotreenode_free(ptr, 0);
		}
		/**
		* Get the creation id of this node.
		* @returns {{ peer: PeerID, counter: number }}
		*/
		creationId() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotreenode_creationId(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Check if the node is deleted.
		* @returns {boolean}
		*/
		isDeleted() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotreenode_isDeleted(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return r0 !== 0;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Move the tree node to be before the target node.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const tree = doc.getTree("tree");
		* const root = tree.createNode();
		* const node = root.createNode();
		* const node2 = root.createNode();
		* node2.moveBefore(node);
		* //   root
		* //  /    \
		* // node2 node
		* ```
		* @param {LoroTreeNode} target
		*/
		moveBefore(target) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				_assertClass(target, LoroTreeNode);
				wasm.lorotreenode_moveBefore(retptr, this.__wbg_ptr, target.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Create a new node as the child of the current node and
		* return an instance of `LoroTreeNode`.
		*
		* If the index is not provided, the new node will be appended to the end.
		*
		* @example
		* ```typescript
		* import { LoroDoc } from "loro-crdt";
		*
		* let doc = new LoroDoc();
		* let tree = doc.getTree("tree");
		* let root = tree.createNode();
		* let node = root.createNode();
		* let node2 = root.createNode(0);
		* //    root
		* //    /  \
		* // node2 node
		* ```
		* @param {number | null} [index]
		* @returns {LoroTreeNode}
		*/
		createNode(index) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotreenode_createNode(retptr, this.__wbg_ptr, isLikeNone(index) ? 4294967297 : index >>> 0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroTreeNode.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the last mover of this node.
		* @returns {{ peer: PeerID, counter: number } | undefined}
		*/
		getLastMoveId() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotreenode_getLastMoveId(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* @returns {any}
		*/
		toJSON() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotreenode_toJSON(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the `Fractional Index` of the node.
		*
		* Note: the tree container must be attached to the document.
		* @returns {string | undefined}
		*/
		fractionalIndex() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotreenode_fractionalIndex(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* @returns {string}
		*/
		__getClassname() {
			let deferred1_0;
			let deferred1_1;
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotreenode___getClassname(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				deferred1_0 = r0;
				deferred1_1 = r1;
				return getStringFromWasm0(r0, r1);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
			}
		}
		/**
		* The TreeID of the node.
		* @returns {TreeID}
		*/
		get id() {
			return takeObject(wasm.lorotreenode_id(this.__wbg_ptr));
		}
		/**
		* @param {LoroTreeNode | undefined} parent
		* @param {number | null} [index]
		*/
		move(parent, index) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotreenode_move(retptr, this.__wbg_ptr, addBorrowedObject(parent), isLikeNone(index) ? 4294967297 : index >>> 0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
				heap[stack_pointer++] = void 0;
			}
		}
		/**
		* Get the associated metadata map container of a tree node.
		* @returns {LoroMap}
		*/
		get data() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotreenode_data(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return LoroMap.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the index of the node in the parent's children.
		* @returns {number | undefined}
		*/
		index() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotreenode_index(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getFloat64(retptr + 0, true);
				var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
				if (getDataViewMemory0().getInt32(retptr + 12, true)) throw takeObject(r2);
				return r0 === 4294967297 ? void 0 : r0;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* @returns {LoroTreeNode | undefined}
		*/
		parent() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.lorotreenode_parent(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return r0 === 0 ? void 0 : LoroTreeNode.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the creator of this node.
		* @returns {PeerID}
		*/
		creator() {
			return takeObject(wasm.lorotreenode_creator(this.__wbg_ptr));
		}
		/**
		* Get the children of this node.
		*
		* The objects returned are new js objects each time because they need to cross
		* the WASM boundary.
		* @returns {any}
		*/
		children() {
			return takeObject(wasm.lorotreenode_children(this.__wbg_ptr));
		}
		/**
		* Move the tree node to be after the target node.
		*
		* @example
		* ```ts
		* import { LoroDoc } from "loro-crdt";
		*
		* const doc = new LoroDoc();
		* const tree = doc.getTree("tree");
		* const root = tree.createNode();
		* const node = root.createNode();
		* const node2 = root.createNode();
		* node2.moveAfter(node);
		* // root
		* //  /  \
		* // node node2
		* ```
		* @param {LoroTreeNode} target
		*/
		moveAfter(target) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				_assertClass(target, LoroTreeNode);
				wasm.lorotreenode_moveAfter(retptr, this.__wbg_ptr, target.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
	};
	var UndoManagerFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_undomanager_free(ptr >>> 0, 1));
	/**
	* `UndoManager` is responsible for handling undo and redo operations.
	*
	* By default, the maxUndoSteps is set to 100, mergeInterval is set to 1000 ms.
	*
	* Each commit made by the current peer is recorded as an undo step in the `UndoManager`.
	* Undo steps can be merged if they occur within a specified merge interval.
	*
	* Note that undo operations are local and cannot revert changes made by other peers.
	* To undo changes made by other peers, consider using the time travel feature.
	*
	* Once the `peerId` is bound to the `UndoManager` in the document, it cannot be changed.
	* Otherwise, the `UndoManager` may not function correctly.
	*/
	var UndoManager = class {
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			UndoManagerFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_undomanager_free(ptr, 0);
		}
		groupStart() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.undomanager_groupStart(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Get the value associated with the top redo stack item, if any.
		* Returns `undefined` if there is no redo item.
		* @returns {Value | undefined}
		*/
		topRedoValue() {
			return takeObject(wasm.undomanager_topRedoValue(this.__wbg_ptr));
		}
		/**
		* Get the value associated with the top undo stack item, if any.
		* Returns `undefined` if there is no undo item.
		* @returns {Value | undefined}
		*/
		topUndoValue() {
			return takeObject(wasm.undomanager_topUndoValue(this.__wbg_ptr));
		}
		/**
		* The number of max undo steps.
		* If the number of undo steps exceeds this number, the oldest undo step will be removed.
		* @param {number} steps
		*/
		setMaxUndoSteps(steps) {
			wasm.undomanager_setMaxUndoSteps(this.__wbg_ptr, steps);
		}
		/**
		* Set the merge interval (in ms).
		*
		* If the interval is set to 0, the undo steps will not be merged.
		* Otherwise, the undo steps will be merged if the interval between the two steps is less than the given interval.
		* @param {number} interval
		*/
		setMergeInterval(interval) {
			wasm.undomanager_setMergeInterval(this.__wbg_ptr, interval);
		}
		/**
		* If a local event's origin matches the given prefix, it will not be recorded in the
		* undo stack.
		* @param {string} prefix
		*/
		addExcludeOriginPrefix(prefix) {
			const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			wasm.undomanager_addExcludeOriginPrefix(this.__wbg_ptr, ptr0, len0);
		}
		/**
		* `UndoManager` is responsible for handling undo and redo operations.
		*
		* PeerID cannot be changed during the lifetime of the UndoManager.
		*
		* Note that undo operations are local and cannot revert changes made by other peers.
		* To undo changes made by other peers, consider using the time travel feature.
		*
		* Each commit made by the current peer is recorded as an undo step in the `UndoManager`.
		* Undo steps can be merged if they occur within a specified merge interval.
		*
		* ## Config
		*
		* - `mergeInterval`: Optional. The interval in milliseconds within which undo steps can be merged. Default is 1000 ms.
		* - `maxUndoSteps`: Optional. The maximum number of undo steps to retain. Default is 100.
		* - `excludeOriginPrefixes`: Optional. An array of string prefixes. Events with origins matching these prefixes will be excluded from undo steps.
		* - `onPush`: Optional. A callback function that is called when an undo/redo step is pushed.
		*    The function can return a meta data value that will be attached to the given stack item.
		* - `onPop`: Optional. A callback function that is called when an undo/redo step is popped.
		*    The function will have a meta data value that was attached to the given stack item when
		*   `onPush` was called.
		* @param {LoroDoc} doc
		* @param {UndoConfig} config
		*/
		constructor(doc, config) {
			_assertClass(doc, LoroDoc);
			const ret = wasm.undomanager_new(doc.__wbg_ptr, addHeapObject(config));
			this.__wbg_ptr = ret >>> 0;
			UndoManagerFinalization.register(this, this.__wbg_ptr, this);
			return this;
		}
		/**
		* Get the peer id of the undo manager.
		* @returns {PeerID}
		*/
		peer() {
			return takeObject(wasm.undomanager_peer(this.__wbg_ptr));
		}
		/**
		* Redo the last undone operation.
		* @returns {boolean}
		*/
		redo() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.undomanager_redo(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return r0 !== 0;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Undo the last operation.
		* @returns {boolean}
		*/
		undo() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.undomanager_undo(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return r0 !== 0;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		clear() {
			wasm.undomanager_clear(this.__wbg_ptr);
		}
		/**
		* Can redo the last operation.
		* @returns {boolean}
		*/
		canRedo() {
			return wasm.undomanager_canRedo(this.__wbg_ptr) !== 0;
		}
		/**
		* Can undo the last operation.
		* @returns {boolean}
		*/
		canUndo() {
			return wasm.undomanager_canUndo(this.__wbg_ptr) !== 0;
		}
		groupEnd() {
			wasm.undomanager_groupEnd(this.__wbg_ptr);
		}
		/**
		* Set the on pop event listener.
		*
		* Every time an undo step or redo step is popped, the on pop event listener will be called.
		* @param {any} on_pop
		*/
		setOnPop(on_pop) {
			wasm.undomanager_setOnPop(this.__wbg_ptr, addHeapObject(on_pop));
		}
		/**
		* Clear only the redo stack, preserving the undo stack.
		*
		* This is useful when coordinating undo/redo across multiple participants
		* (e.g., multiple editors) where a new edit in one participant should
		* invalidate redo in all other participants.
		*/
		clearRedo() {
			wasm.undomanager_clearRedo(this.__wbg_ptr);
		}
		/**
		* Clear only the undo stack, preserving the redo stack.
		*/
		clearUndo() {
			wasm.undomanager_clearUndo(this.__wbg_ptr);
		}
		/**
		* Set the on push event listener.
		*
		* Every time an undo step or redo step is pushed, the on push event listener will be called.
		* @param {any} on_push
		*/
		setOnPush(on_push) {
			wasm.undomanager_setOnPush(this.__wbg_ptr, addHeapObject(on_push));
		}
	};
	var VersionVectorFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_versionvector_free(ptr >>> 0, 1));
	/**
	* [VersionVector](https://en.wikipedia.org/wiki/Version_vector)
	* is a map from [PeerID] to [Counter]. Its a right-open interval.
	*
	* i.e. a [VersionVector] of `{A: 1, B: 2}` means that A has 1 atomic op and B has 2 atomic ops,
	* thus ID of `{client: A, counter: 1}` is out of the range.
	*/
	var VersionVector = class VersionVector {
		static __wrap(ptr) {
			ptr = ptr >>> 0;
			const obj = Object.create(VersionVector.prototype);
			obj.__wbg_ptr = ptr;
			VersionVectorFinalization.register(obj, obj.__wbg_ptr, obj);
			return obj;
		}
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			VersionVectorFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_versionvector_free(ptr, 0);
		}
		/**
		* Get the counter of a peer.
		* @param {number | bigint | `${number}`} peer_id
		* @returns {number | undefined}
		*/
		get(peer_id) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.versionvector_get(retptr, this.__wbg_ptr, addHeapObject(peer_id));
				var r0 = getDataViewMemory0().getFloat64(retptr + 0, true);
				var r2 = getDataViewMemory0().getInt32(retptr + 8, true);
				if (getDataViewMemory0().getInt32(retptr + 12, true)) throw takeObject(r2);
				return r0 === 4294967297 ? void 0 : r0;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Create a new version vector.
		* @param {Map<PeerID, number> | Uint8Array | VersionVector | undefined | null} value
		*/
		constructor(value) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.versionvector_new(retptr, addHeapObject(value));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				this.__wbg_ptr = r0 >>> 0;
				VersionVectorFinalization.register(this, this.__wbg_ptr, this);
				return this;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Decode the version vector from a Uint8Array.
		* @param {Uint8Array} bytes
		* @returns {VersionVector}
		*/
		static decode(bytes) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
				const len0 = WASM_VECTOR_LEN;
				wasm.versionvector_decode(retptr, ptr0, len0);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return VersionVector.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Encode the version vector into a Uint8Array.
		* @returns {Uint8Array}
		*/
		encode() {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.versionvector_encode(retptr, this.__wbg_ptr);
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				var v1 = getArrayU8FromWasm0(r0, r1).slice();
				wasm.__wbindgen_free(r0, r1 * 1, 1);
				return v1;
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* @returns {number}
		*/
		length() {
			return wasm.versionvector_length(this.__wbg_ptr) >>> 0;
		}
		/**
		* @param {PeerID} peer
		*/
		remove(peer) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.versionvector_remove(retptr, this.__wbg_ptr, addHeapObject(peer));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* set the exclusive ending point. target id will NOT be included by self
		* @param {{ peer: PeerID, counter: number }} id
		*/
		setEnd(id) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.versionvector_setEnd(retptr, this.__wbg_ptr, addHeapObject(id));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Compare the version vector with another version vector.
		*
		* If they are concurrent, return undefined.
		* @param {VersionVector} other
		* @returns {number | undefined}
		*/
		compare(other) {
			_assertClass(other, VersionVector);
			const ret = wasm.versionvector_compare(this.__wbg_ptr, other.__wbg_ptr);
			return ret === 4294967297 ? void 0 : ret;
		}
		/**
		* set the inclusive ending point. target id will be included
		* @param {{ peer: PeerID, counter: number }} id
		*/
		setLast(id) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.versionvector_setLast(retptr, this.__wbg_ptr, addHeapObject(id));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				if (getDataViewMemory0().getInt32(retptr + 4, true)) throw takeObject(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
		/**
		* Convert the version vector to a Map
		* @returns {Map<PeerID, number>}
		*/
		toJSON() {
			return takeObject(wasm.versionvector_toJSON(this.__wbg_ptr));
		}
		/**
		* Create a new version vector from a Map.
		* @param {Map<PeerID, number>} version
		* @returns {VersionVector}
		*/
		static parseJSON(version) {
			try {
				const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
				wasm.versionvector_parseJSON(retptr, addHeapObject(version));
				var r0 = getDataViewMemory0().getInt32(retptr + 0, true);
				var r1 = getDataViewMemory0().getInt32(retptr + 4, true);
				if (getDataViewMemory0().getInt32(retptr + 8, true)) throw takeObject(r1);
				return VersionVector.__wrap(r0);
			} finally {
				wasm.__wbindgen_add_to_stack_pointer(16);
			}
		}
	};
	async function __wbg_load(module, imports) {
		if (typeof Response === "function" && module instanceof Response) {
			if (typeof WebAssembly.instantiateStreaming === "function") try {
				return await WebAssembly.instantiateStreaming(module, imports);
			} catch (e) {
				if (module.headers.get("Content-Type") != "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
				else throw e;
			}
			const bytes = await module.arrayBuffer();
			return await WebAssembly.instantiate(bytes, imports);
		} else {
			const instance = await WebAssembly.instantiate(module, imports);
			if (instance instanceof WebAssembly.Instance) return {
				instance,
				module
			};
			else return instance;
		}
	}
	function __wbg_get_imports() {
		const imports = {};
		imports.wbg = {};
		imports.wbg.__wbg_String_8f0eb39a4a4c2f66 = function(arg0, arg1) {
			const ptr1 = passStringToWasm0(String(getObject(arg1)), wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4, len1, true);
			getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
		};
		imports.wbg.__wbg_apply_36be6a55257c99bf = function() {
			return handleError(function(arg0, arg1, arg2) {
				return addHeapObject(getObject(arg0).apply(getObject(arg1), getObject(arg2)));
			}, arguments);
		};
		imports.wbg.__wbg_apply_eb9e9b97497f91e4 = function() {
			return handleError(function(arg0, arg1, arg2) {
				return addHeapObject(Reflect.apply(getObject(arg0), getObject(arg1), getObject(arg2)));
			}, arguments);
		};
		imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
			const ret = getObject(arg0).buffer;
			return addHeapObject(ret);
		};
		imports.wbg.__wbg_call_672a4d21634d4a24 = function() {
			return handleError(function(arg0, arg1) {
				return addHeapObject(getObject(arg0).call(getObject(arg1)));
			}, arguments);
		};
		imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() {
			return handleError(function(arg0, arg1, arg2) {
				return addHeapObject(getObject(arg0).call(getObject(arg1), getObject(arg2)));
			}, arguments);
		};
		imports.wbg.__wbg_call_833bed5770ea2041 = function() {
			return handleError(function(arg0, arg1, arg2, arg3) {
				return addHeapObject(getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3)));
			}, arguments);
		};
		imports.wbg.__wbg_call_b8adc8b1d0a0d8eb = function() {
			return handleError(function(arg0, arg1, arg2, arg3, arg4) {
				return addHeapObject(getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3), getObject(arg4)));
			}, arguments);
		};
		imports.wbg.__wbg_changemodifier_new = function(arg0) {
			return addHeapObject(ChangeModifier.__wrap(arg0));
		};
		imports.wbg.__wbg_crypto_574e78ad8b13b65f = function(arg0) {
			const ret = getObject(arg0).crypto;
			return addHeapObject(ret);
		};
		imports.wbg.__wbg_cursor_new = function(arg0) {
			return addHeapObject(Cursor.__wrap(arg0));
		};
		imports.wbg.__wbg_done_769e5ede4b31c67b = function(arg0) {
			return getObject(arg0).done;
		};
		imports.wbg.__wbg_entries_3265d4158b33e5dc = function(arg0) {
			return addHeapObject(Object.entries(getObject(arg0)));
		};
		imports.wbg.__wbg_entries_c8a90a7ed73e84ce = function(arg0) {
			return addHeapObject(getObject(arg0).entries());
		};
		imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
			let deferred0_0;
			let deferred0_1;
			try {
				deferred0_0 = arg0;
				deferred0_1 = arg1;
				console.error(getStringFromWasm0(arg0, arg1));
			} finally {
				wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
			}
		};
		imports.wbg.__wbg_error_f6a75ad50e51d222 = function(arg0, arg1) {
			console.error(getStringFromWasm0(arg0, arg1));
		};
		imports.wbg.__wbg_from_2a5d3e218e67aa85 = function(arg0) {
			return addHeapObject(Array.from(getObject(arg0)));
		};
		imports.wbg.__wbg_getOwnPropertySymbols_97eebed6fe6e08be = function(arg0) {
			return addHeapObject(Object.getOwnPropertySymbols(getObject(arg0)));
		};
		imports.wbg.__wbg_getRandomValues_b8f5dbd5f3995a9e = function() {
			return handleError(function(arg0, arg1) {
				getObject(arg0).getRandomValues(getObject(arg1));
			}, arguments);
		};
		imports.wbg.__wbg_get_67b2ba62fc30de12 = function() {
			return handleError(function(arg0, arg1) {
				return addHeapObject(Reflect.get(getObject(arg0), getObject(arg1)));
			}, arguments);
		};
		imports.wbg.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
			const ret = getObject(arg0)[arg1 >>> 0];
			return addHeapObject(ret);
		};
		imports.wbg.__wbg_getindex_5b00c274b05714aa = function(arg0, arg1) {
			return getObject(arg0)[arg1 >>> 0];
		};
		imports.wbg.__wbg_getwithrefkey_1dc361bd10053bfe = function(arg0, arg1) {
			const ret = getObject(arg0)[getObject(arg1)];
			return addHeapObject(ret);
		};
		imports.wbg.__wbg_instanceof_ArrayBuffer_e14585432e3737fc = function(arg0) {
			let result;
			try {
				result = getObject(arg0) instanceof ArrayBuffer;
			} catch (_) {
				result = false;
			}
			return result;
		};
		imports.wbg.__wbg_instanceof_Map_f3469ce2244d2430 = function(arg0) {
			let result;
			try {
				result = getObject(arg0) instanceof Map;
			} catch (_) {
				result = false;
			}
			return result;
		};
		imports.wbg.__wbg_instanceof_Object_7f2dcef8f78644a4 = function(arg0) {
			let result;
			try {
				result = getObject(arg0) instanceof Object;
			} catch (_) {
				result = false;
			}
			return result;
		};
		imports.wbg.__wbg_instanceof_Uint8Array_17156bcf118086a9 = function(arg0) {
			let result;
			try {
				result = getObject(arg0) instanceof Uint8Array;
			} catch (_) {
				result = false;
			}
			return result;
		};
		imports.wbg.__wbg_isArray_a1eab7e0d067391b = function(arg0) {
			return Array.isArray(getObject(arg0));
		};
		imports.wbg.__wbg_isSafeInteger_343e2beeeece1bb0 = function(arg0) {
			return Number.isSafeInteger(getObject(arg0));
		};
		imports.wbg.__wbg_iterator_9a24c88df860dc65 = function() {
			const ret = Symbol.iterator;
			return addHeapObject(ret);
		};
		imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
			return getObject(arg0).length;
		};
		imports.wbg.__wbg_length_e2d2a49132c1b256 = function(arg0) {
			return getObject(arg0).length;
		};
		imports.wbg.__wbg_log_0cc1b7768397bcfe = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
			let deferred0_0;
			let deferred0_1;
			try {
				deferred0_0 = arg0;
				deferred0_1 = arg1;
				console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
			} finally {
				wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
			}
		};
		imports.wbg.__wbg_log_1a3aa82c18462a2b = function(arg0, arg1) {
			console.log(getStringFromWasm0(arg0, arg1));
		};
		imports.wbg.__wbg_log_cb9e190acc5753fb = function(arg0, arg1) {
			let deferred0_0;
			let deferred0_1;
			try {
				deferred0_0 = arg0;
				deferred0_1 = arg1;
				console.log(getStringFromWasm0(arg0, arg1));
			} finally {
				wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
			}
		};
		imports.wbg.__wbg_lorocounter_new = function(arg0) {
			return addHeapObject(LoroCounter.__wrap(arg0));
		};
		imports.wbg.__wbg_lorolist_new = function(arg0) {
			return addHeapObject(LoroList.__wrap(arg0));
		};
		imports.wbg.__wbg_loromap_new = function(arg0) {
			return addHeapObject(LoroMap.__wrap(arg0));
		};
		imports.wbg.__wbg_loromovablelist_new = function(arg0) {
			return addHeapObject(LoroMovableList.__wrap(arg0));
		};
		imports.wbg.__wbg_lorotext_new = function(arg0) {
			return addHeapObject(LoroText.__wrap(arg0));
		};
		imports.wbg.__wbg_lorotree_new = function(arg0) {
			return addHeapObject(LoroTree.__wrap(arg0));
		};
		imports.wbg.__wbg_lorotreenode_new = function(arg0) {
			return addHeapObject(LoroTreeNode.__wrap(arg0));
		};
		imports.wbg.__wbg_mark_7438147ce31e9d4b = function(arg0, arg1) {
			performance.mark(getStringFromWasm0(arg0, arg1));
		};
		imports.wbg.__wbg_measure_fb7825c11612c823 = function() {
			return handleError(function(arg0, arg1, arg2, arg3) {
				let deferred0_0;
				let deferred0_1;
				let deferred1_0;
				let deferred1_1;
				try {
					deferred0_0 = arg0;
					deferred0_1 = arg1;
					deferred1_0 = arg2;
					deferred1_1 = arg3;
					performance.measure(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
				} finally {
					wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
					wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
				}
			}, arguments);
		};
		imports.wbg.__wbg_msCrypto_a61aeb35a24c1329 = function(arg0) {
			const ret = getObject(arg0).msCrypto;
			return addHeapObject(ret);
		};
		imports.wbg.__wbg_new_405e22f390576ce2 = function() {
			return addHeapObject(/* @__PURE__ */ new Object());
		};
		imports.wbg.__wbg_new_5e0be73521bc8c17 = function() {
			return addHeapObject(/* @__PURE__ */ new Map());
		};
		imports.wbg.__wbg_new_78feb108b6472713 = function() {
			return addHeapObject(new Array());
		};
		imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
			return addHeapObject(/* @__PURE__ */ new Error());
		};
		imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
			return addHeapObject(new Uint8Array(getObject(arg0)));
		};
		imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
			return addHeapObject(new Function(getStringFromWasm0(arg0, arg1)));
		};
		imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
			return addHeapObject(new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0));
		};
		imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
			return addHeapObject(new Uint8Array(arg0 >>> 0));
		};
		imports.wbg.__wbg_newwithlength_c4c419ef0bc8a1f8 = function(arg0) {
			return addHeapObject(new Array(arg0 >>> 0));
		};
		imports.wbg.__wbg_next_25feadfc0913fea9 = function(arg0) {
			const ret = getObject(arg0).next;
			return addHeapObject(ret);
		};
		imports.wbg.__wbg_next_6574e1a8a62d1055 = function() {
			return handleError(function(arg0) {
				return addHeapObject(getObject(arg0).next());
			}, arguments);
		};
		imports.wbg.__wbg_node_905d3e251edff8a2 = function(arg0) {
			const ret = getObject(arg0).node;
			return addHeapObject(ret);
		};
		imports.wbg.__wbg_now_829357f5fa91c9dd = function() {
			return Date.now();
		};
		imports.wbg.__wbg_ownKeys_3930041068756f1f = function() {
			return handleError(function(arg0) {
				return addHeapObject(Reflect.ownKeys(getObject(arg0)));
			}, arguments);
		};
		imports.wbg.__wbg_process_dc0fbacc7c1c06f7 = function(arg0) {
			const ret = getObject(arg0).process;
			return addHeapObject(ret);
		};
		imports.wbg.__wbg_push_737cfc8c1432c2c6 = function(arg0, arg1) {
			return getObject(arg0).push(getObject(arg1));
		};
		imports.wbg.__wbg_randomFillSync_ac0988aba3254290 = function() {
			return handleError(function(arg0, arg1) {
				getObject(arg0).randomFillSync(takeObject(arg1));
			}, arguments);
		};
		imports.wbg.__wbg_require_60cc747a6bc5215a = function() {
			return handleError(function() {
				const ret = module.require;
				return addHeapObject(ret);
			}, arguments);
		};
		imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
			return addHeapObject(Promise.resolve(getObject(arg0)));
		};
		imports.wbg.__wbg_set_37837023f3d740e8 = function(arg0, arg1, arg2) {
			getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
		};
		imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
			getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
		};
		imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
			getObject(arg0).set(getObject(arg1), arg2 >>> 0);
		};
		imports.wbg.__wbg_set_8fc6bf8a5b1071d1 = function(arg0, arg1, arg2) {
			return addHeapObject(getObject(arg0).set(getObject(arg1), getObject(arg2)));
		};
		imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() {
			return handleError(function(arg0, arg1, arg2) {
				return Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
			}, arguments);
		};
		imports.wbg.__wbg_setindex_dcd71eabf405bde1 = function(arg0, arg1, arg2) {
			getObject(arg0)[arg1 >>> 0] = arg2;
		};
		imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
			const ret = getObject(arg1).stack;
			const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4, len1, true);
			getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
		};
		imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
			const ret = typeof global === "undefined" ? null : global;
			return isLikeNone(ret) ? 0 : addHeapObject(ret);
		};
		imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
			const ret = typeof globalThis === "undefined" ? null : globalThis;
			return isLikeNone(ret) ? 0 : addHeapObject(ret);
		};
		imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
			const ret = typeof self === "undefined" ? null : self;
			return isLikeNone(ret) ? 0 : addHeapObject(ret);
		};
		imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
			const ret = typeof window === "undefined" ? null : window;
			return isLikeNone(ret) ? 0 : addHeapObject(ret);
		};
		imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
			return addHeapObject(getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0));
		};
		imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
			return addHeapObject(getObject(arg0).then(getObject(arg1)));
		};
		imports.wbg.__wbg_value_cd1ffa7b1ab794f1 = function(arg0) {
			const ret = getObject(arg0).value;
			return addHeapObject(ret);
		};
		imports.wbg.__wbg_versions_c01dfd4722a88165 = function(arg0) {
			const ret = getObject(arg0).versions;
			return addHeapObject(ret);
		};
		imports.wbg.__wbg_versionvector_new = function(arg0) {
			return addHeapObject(VersionVector.__wrap(arg0));
		};
		imports.wbg.__wbg_warn_be76a6bab0e2fef3 = function(arg0, arg1) {
			console.warn(getStringFromWasm0(arg0, arg1));
		};
		imports.wbg.__wbindgen_as_number = function(arg0) {
			return +getObject(arg0);
		};
		imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
			return addHeapObject(arg0);
		};
		imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
			return addHeapObject(BigInt.asUintN(64, arg0));
		};
		imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
			const v = getObject(arg1);
			const ret = typeof v === "bigint" ? v : void 0;
			getDataViewMemory0().setBigInt64(arg0 + 8, isLikeNone(ret) ? BigInt(0) : ret, true);
			getDataViewMemory0().setInt32(arg0 + 0, !isLikeNone(ret), true);
		};
		imports.wbg.__wbindgen_boolean_get = function(arg0) {
			const v = getObject(arg0);
			return typeof v === "boolean" ? v ? 1 : 0 : 2;
		};
		imports.wbg.__wbindgen_cb_drop = function(arg0) {
			const obj = takeObject(arg0).original;
			if (obj.cnt-- == 1) {
				obj.a = 0;
				return true;
			}
			return false;
		};
		imports.wbg.__wbindgen_closure_wrapper331 = function(arg0, arg1, arg2) {
			return addHeapObject(makeMutClosure(arg0, arg1, 9, __wbg_adapter_60));
		};
		imports.wbg.__wbindgen_closure_wrapper333 = function(arg0, arg1, arg2) {
			return addHeapObject(makeMutClosure(arg0, arg1, 9, __wbg_adapter_63));
		};
		imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
			const ptr1 = passStringToWasm0(debugString(getObject(arg1)), wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4, len1, true);
			getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
		};
		imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
			return addHeapObject(new Error(getStringFromWasm0(arg0, arg1)));
		};
		imports.wbg.__wbindgen_in = function(arg0, arg1) {
			return getObject(arg0) in getObject(arg1);
		};
		imports.wbg.__wbindgen_is_array = function(arg0) {
			return Array.isArray(getObject(arg0));
		};
		imports.wbg.__wbindgen_is_bigint = function(arg0) {
			return typeof getObject(arg0) === "bigint";
		};
		imports.wbg.__wbindgen_is_falsy = function(arg0) {
			return !getObject(arg0);
		};
		imports.wbg.__wbindgen_is_function = function(arg0) {
			return typeof getObject(arg0) === "function";
		};
		imports.wbg.__wbindgen_is_null = function(arg0) {
			return getObject(arg0) === null;
		};
		imports.wbg.__wbindgen_is_object = function(arg0) {
			const val = getObject(arg0);
			return typeof val === "object" && val !== null;
		};
		imports.wbg.__wbindgen_is_string = function(arg0) {
			return typeof getObject(arg0) === "string";
		};
		imports.wbg.__wbindgen_is_undefined = function(arg0) {
			return getObject(arg0) === void 0;
		};
		imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
			return getObject(arg0) === getObject(arg1);
		};
		imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
			return getObject(arg0) == getObject(arg1);
		};
		imports.wbg.__wbindgen_memory = function() {
			const ret = wasm.memory;
			return addHeapObject(ret);
		};
		imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
			const obj = getObject(arg1);
			const ret = typeof obj === "number" ? obj : void 0;
			getDataViewMemory0().setFloat64(arg0 + 8, isLikeNone(ret) ? 0 : ret, true);
			getDataViewMemory0().setInt32(arg0 + 0, !isLikeNone(ret), true);
		};
		imports.wbg.__wbindgen_number_new = function(arg0) {
			return addHeapObject(arg0);
		};
		imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
			return addHeapObject(getObject(arg0));
		};
		imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
			takeObject(arg0);
		};
		imports.wbg.__wbindgen_rethrow = function(arg0) {
			throw takeObject(arg0);
		};
		imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
			const obj = getObject(arg1);
			const ret = typeof obj === "string" ? obj : void 0;
			var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			var len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4, len1, true);
			getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
		};
		imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
			return addHeapObject(getStringFromWasm0(arg0, arg1));
		};
		imports.wbg.__wbindgen_throw = function(arg0, arg1) {
			throw new Error(getStringFromWasm0(arg0, arg1));
		};
		imports.wbg.__wbindgen_typeof = function(arg0) {
			return addHeapObject(typeof getObject(arg0));
		};
		return imports;
	}
	function __wbg_finalize_init(instance, module) {
		wasm = instance.exports;
		__wbg_init.__wbindgen_wasm_module = module;
		cachedDataViewMemory0 = null;
		cachedUint8ArrayMemory0 = null;
		wasm.__wbindgen_start();
		return wasm;
	}
	function initSync(module) {
		if (wasm !== void 0) return wasm;
		if (typeof module !== "undefined") {
			if (Object.getPrototypeOf(module) === Object.prototype) ({module} = module);
			else console.warn("using deprecated parameters for `initSync()`; pass a single object instead");
		}
		const imports = __wbg_get_imports();
		if (!(module instanceof WebAssembly.Module)) module = new WebAssembly.Module(module);
		return __wbg_finalize_init(new WebAssembly.Instance(module, imports), module);
	}
	async function __wbg_init(module_or_path) {
		if (wasm !== void 0) return wasm;
		if (typeof module_or_path !== "undefined") {
			if (Object.getPrototypeOf(module_or_path) === Object.prototype) ({module_or_path} = module_or_path);
			else console.warn("using deprecated parameters for the initialization function; pass a single object instead");
		}
		if (typeof module_or_path === "undefined") module_or_path = void 0;
		const imports = __wbg_get_imports();
		if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) module_or_path = fetch(module_or_path);
		const { instance, module } = await __wbg_load(await module_or_path, imports);
		return __wbg_finalize_init(instance, module);
	}
	// node_modules/loro-crdt/web/index.js
	var web_exports = /* @__PURE__ */ __exportAll({
		Awareness: () => Awareness,
		AwarenessWasm: () => AwarenessWasm,
		ChangeModifier: () => ChangeModifier,
		Cursor: () => Cursor,
		EphemeralStore: () => EphemeralStore,
		EphemeralStoreWasm: () => EphemeralStoreWasm,
		LORO_VERSION: () => LORO_VERSION,
		Loro: () => Loro,
		LoroCounter: () => LoroCounter,
		LoroDoc: () => LoroDoc,
		LoroList: () => LoroList,
		LoroMap: () => LoroMap,
		LoroMovableList: () => LoroMovableList,
		LoroText: () => LoroText,
		LoroTree: () => LoroTree,
		LoroTreeNode: () => LoroTreeNode,
		UndoManager: () => UndoManager,
		VersionVector: () => VersionVector,
		callPendingEvents: () => callPendingEvents,
		decodeFrontiers: () => decodeFrontiers,
		decodeImportBlobMeta: () => decodeImportBlobMeta,
		default: () => __wbg_init,
		encodeFrontiers: () => encodeFrontiers,
		getType: () => getType,
		idStrToId: () => idStrToId,
		initSync: () => initSync,
		isContainer: () => isContainer,
		isContainerId: () => isContainerId,
		newContainerID: () => newContainerID,
		newRootContainerID: () => newRootContainerID,
		redactJsonUpdates: () => redactJsonUpdates,
		run: () => run,
		setDebug: () => setDebug
	});
	/**
	* @deprecated Please use LoroDoc
	*/
	var Loro = class extends LoroDoc {};
	var CONTAINER_TYPES = [
		"Map",
		"Text",
		"List",
		"Tree",
		"MovableList",
		"Counter"
	];
	function isContainerId(s) {
		return s.startsWith("cid:");
	}
	/**  Whether the value is a container.
	*
	* # Example
	*
	* ```ts
	* const doc = new LoroDoc();
	* const map = doc.getMap("map");
	* const list = doc.getList("list");
	* const text = doc.getText("text");
	* isContainer(map); // true
	* isContainer(list); // true
	* isContainer(text); // true
	* isContainer(123); // false
	* isContainer("123"); // false
	* isContainer({}); // false
	* ```
	*/
	function isContainer(value) {
		if (typeof value !== "object" || value == null) return false;
		const p = Object.getPrototypeOf(value);
		if (p == null || typeof p !== "object" || typeof p["kind"] !== "function") return false;
		return CONTAINER_TYPES.includes(value.kind());
	}
	/**  Get the type of a value that may be a container.
	*
	* # Example
	*
	* ```ts
	* const doc = new LoroDoc();
	* const map = doc.getMap("map");
	* const list = doc.getList("list");
	* const text = doc.getText("text");
	* getType(map); // "Map"
	* getType(list); // "List"
	* getType(text); // "Text"
	* getType(123); // "Json"
	* getType("123"); // "Json"
	* getType({}); // "Json"
	* ```
	*/
	function getType(value) {
		if (isContainer(value)) return value.kind();
		return "Json";
	}
	function newContainerID(id, type) {
		return `cid:${id.counter}@${id.peer}:${type}`;
	}
	function newRootContainerID(name, type) {
		return `cid:root-${name}:${type}`;
	}
	/**
	* @deprecated Please use `EphemeralStore` instead.
	*
	* Awareness is a structure that allows to track the ephemeral state of the peers.
	*
	* If we don't receive a state update from a peer within the timeout, we will remove their state.
	* The timeout is in milliseconds. This can be used to handle the offline state of a peer.
	*/
	var Awareness = class {
		constructor(peer, timeout = 3e4) {
			this.listeners = /* @__PURE__ */ new Set();
			this.inner = new AwarenessWasm(peer, timeout);
			this.peer = peer;
			this.timeout = timeout;
		}
		apply(bytes, origin = "remote") {
			const { updated, added } = this.inner.apply(bytes);
			this.listeners.forEach((listener) => {
				listener({
					updated,
					added,
					removed: []
				}, origin);
			});
			this.startTimerIfNotEmpty();
		}
		setLocalState(state) {
			const wasEmpty = this.inner.getState(this.peer) == null;
			this.inner.setLocalState(state);
			if (wasEmpty) this.listeners.forEach((listener) => {
				listener({
					updated: [],
					added: [this.inner.peer()],
					removed: []
				}, "local");
			});
			else this.listeners.forEach((listener) => {
				listener({
					updated: [this.inner.peer()],
					added: [],
					removed: []
				}, "local");
			});
			this.startTimerIfNotEmpty();
		}
		getLocalState() {
			return this.inner.getState(this.peer);
		}
		getAllStates() {
			return this.inner.getAllStates();
		}
		encode(peers) {
			return this.inner.encode(peers);
		}
		encodeAll() {
			return this.inner.encodeAll();
		}
		addListener(listener) {
			this.listeners.add(listener);
		}
		removeListener(listener) {
			this.listeners.delete(listener);
		}
		peers() {
			return this.inner.peers();
		}
		destroy() {
			clearInterval(this.timer);
			this.listeners.clear();
		}
		startTimerIfNotEmpty() {
			if (this.inner.isEmpty() || this.timer != null) return;
			this.timer = setInterval(() => {
				const removed = this.inner.removeOutdated();
				if (removed.length > 0) this.listeners.forEach((listener) => {
					listener({
						updated: [],
						added: [],
						removed
					}, "timeout");
				});
				if (this.inner.isEmpty()) {
					clearInterval(this.timer);
					this.timer = void 0;
				}
			}, this.timeout / 2);
		}
	};
	/**
	* EphemeralStore tracks ephemeral key-value state across peers.
	*
	* - Use it for lightweight presence/state like cursors, selections, and UI hints.
	* - Conflict resolution is timestamp-based LWW (Last-Write-Wins) per key.
	* - Timeout unit: milliseconds.
	* - After timeout: keys are considered expired. They are omitted from
	*   `encode(key)`, `encodeAll()` and `getAllStates()`. A periodic cleanup runs
	*   while the store is non-empty and removes expired keys; when removals happen
	*   subscribers receive an event with `by: "timeout"` and the `removed` keys.
	*
	* See: https://loro.dev/docs/tutorial/ephemeral
	*
	* @param timeout Inactivity timeout in milliseconds (default: 30000). If a key
	* doesn't receive updates within this duration, it will expire and be removed
	* on the next cleanup tick.
	*
	* @example
	* ```ts
	* const store = new EphemeralStore();
	* const store2 = new EphemeralStore();
	* // Subscribe to local updates and forward over the wire
	* store.subscribeLocalUpdates((data) => {
	*   store2.apply(data);
	* });
	* // Subscribe to all updates (including removals by timeout)
	* store2.subscribe((event) => {
	*   console.log("event:", event);
	* });
	* // Set a value
	* store.set("key", "value");
	* // Encode the value
	* const encoded = store.encode("key");
	* // Apply the encoded value
	* store2.apply(encoded);
	* ```
	*/
	var EphemeralStore = class {
		constructor(timeout = 3e4) {
			this.inner = new EphemeralStoreWasm(timeout);
			this.timeout = timeout;
		}
		apply(bytes) {
			this.inner.apply(bytes);
			this.startTimerIfNotEmpty();
		}
		set(key, value) {
			this.inner.set(key, value);
			this.startTimerIfNotEmpty();
		}
		delete(key) {
			this.inner.delete(key);
		}
		get(key) {
			return this.inner.get(key);
		}
		getAllStates() {
			return this.inner.getAllStates();
		}
		encode(key) {
			return this.inner.encode(key);
		}
		encodeAll() {
			return this.inner.encodeAll();
		}
		keys() {
			return this.inner.keys();
		}
		destroy() {
			clearInterval(this.timer);
		}
		subscribe(listener) {
			return this.inner.subscribe(listener);
		}
		subscribeLocalUpdates(listener) {
			return this.inner.subscribeLocalUpdates(listener);
		}
		startTimerIfNotEmpty() {
			if (this.inner.isEmpty() || this.timer != null) return;
			this.timer = setInterval(() => {
				this.inner.removeOutdated();
				if (this.inner.isEmpty()) {
					clearInterval(this.timer);
					this.timer = void 0;
				}
			}, this.timeout / 2);
		}
	};
	LoroDoc.prototype.toJsonWithReplacer = function(replacer) {
		const processed = /* @__PURE__ */ new Set();
		const doc = this;
		const m = (key, value) => {
			if (typeof value === "string") {
				if (isContainerId(value) && !processed.has(value)) {
					processed.add(value);
					const container = doc.getContainerById(value);
					if (container == null) throw new Error(`ContainerID not found: ${value}`);
					const ans = replacer(key, container);
					if (ans === container) {
						const ans = container.getShallowValue();
						if (typeof ans === "object") return run(ans);
						return ans;
					}
					if (isContainer(ans)) throw new Error("Using new container is not allowed in toJsonWithReplacer");
					if (typeof ans === "object" && ans != null) return run(ans);
					return ans;
				}
			}
			if (typeof value === "object" && value != null) return run(value);
			const ans = replacer(key, value);
			if (isContainer(ans)) throw new Error("Using new container is not allowed in toJsonWithReplacer");
			return ans;
		};
		const run = (layer) => {
			if (Array.isArray(layer)) return layer.map((item, index) => {
				return m(index, item);
			}).filter((item) => item !== void 0);
			const result = {};
			for (const [key, value] of Object.entries(layer)) {
				const ans = m(key, value);
				if (ans !== void 0) result[key] = ans;
			}
			return result;
		};
		return run(doc.getShallowValue());
	};
	function idStrToId(idStr) {
		const [counter, peer] = idStr.split("@");
		return {
			counter: parseInt(counter),
			peer
		};
	}
	var CALL_PENDING_EVENTS_WRAPPED = Symbol("loro.callPendingEventsWrapped");
	function decorateMethod(prototype, method) {
		const descriptor = Object.getOwnPropertyDescriptor(prototype, method);
		if (!descriptor || typeof descriptor.value !== "function") return;
		const original = descriptor.value;
		if (original[CALL_PENDING_EVENTS_WRAPPED]) return;
		const wrapped = function(...args) {
			let result;
			try {
				result = original.apply(this, args);
				return result;
			} finally {
				if (result && typeof result.then === "function") result.finally(() => {
					callPendingEvents();
				});
				else callPendingEvents();
			}
		};
		wrapped[CALL_PENDING_EVENTS_WRAPPED] = true;
		Object.defineProperty(prototype, method, {
			...descriptor,
			value: wrapped
		});
	}
	function decorateMethods(prototype, methods) {
		for (const method of methods) decorateMethod(prototype, method);
	}
	decorateMethods(LoroDoc.prototype, [
		"setDetachedEditing",
		"attach",
		"detach",
		"fork",
		"forkAt",
		"checkoutToLatest",
		"checkout",
		"commit",
		"getCursorPos",
		"revertTo",
		"export",
		"exportJsonUpdates",
		"exportJsonInIdSpan",
		"importJsonUpdates",
		"import",
		"importUpdateBatch",
		"importBatch",
		"travelChangeAncestors",
		"getChangedContainersIn",
		"diff",
		"applyDiff",
		"setPeerId"
	]);
	decorateMethods(EphemeralStoreWasm.prototype, [
		"set",
		"delete",
		"apply",
		"removeOutdated"
	]);
	decorateMethods(UndoManager.prototype, ["undo", "redo"]);
	// src/osvauld.ts
	var bytesToBase64 = (bytes) => {
		let text = "";
		for (let i = 0; i < bytes.length; i += 32768) text += String.fromCharCode(...bytes.subarray(i, i + 32768));
		return btoa(text);
	};
	var base64ToBytes = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
	function createOsvauld(deps) {
		const waitMs = deps.waitMs ?? 15e3;
		const sleep = deps.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
		const entries = /* @__PURE__ */ new Map();
		const handlers = /* @__PURE__ */ new Set();
		let loaded;
		async function load(path, old) {
			loaded ??= await deps.loadLoro();
			const { LoroDoc } = loaded;
			const opened = await deps.call("open", { doc: path });
			const doc = new LoroDoc();
			const snapshot = base64ToBytes(opened.snapshot);
			if (snapshot.length) doc.import(snapshot);
			const entry = {
				path,
				doc,
				write: opened.write === true,
				dead: false,
				queue: Promise.resolve(),
				subs: old?.subs ?? /* @__PURE__ */ new Set()
			};
			if (entry.write) doc.setPeerId(opened.peer);
			const subscribe = doc.subscribe.bind(doc);
			for (const sub of entry.subs) sub.off = subscribe(sub.listener);
			doc.subscribe = (listener) => {
				const sub = {
					listener,
					off: subscribe(listener)
				};
				entry.subs.add(sub);
				return () => {
					sub.off();
					entry.subs.delete(sub);
				};
			};
			if (entry.write) doc.subscribeLocalUpdates((update) => send(entry, update));
			else if (path.includes(":")) doc.subscribeLocalUpdates(() => {
				console.error(`osvauld: "${path}" belongs to another app and is read-only; the edit was dropped`);
				refuse(entry, "read_only");
			});
			follow(entry);
			return entry;
		}
		function send(entry, update) {
			entry.queue = entry.queue.then(async () => {
				if (entry.dead) return;
				try {
					await deps.call("apply", {
						doc: entry.path,
						update: bytesToBase64(update)
					});
				} catch (error) {
					await refuse(entry, error?.code ?? "failed");
				}
			});
		}
		async function refuse(entry, why) {
			if (entry.dead) return;
			entry.dead = true;
			for (const sub of entry.subs) sub.off();
			const next = load(entry.path, entry);
			entries.set(entry.path, next);
			try {
				const fresh = await next;
				for (const sub of fresh.subs) try {
					sub.listener({
						by: "import",
						origin: "osvauld.reload",
						events: []
					});
				} catch {}
				for (const handler of handlers) try {
					handler(entry.path, why, fresh.doc);
				} catch {}
			} catch {
				entries.delete(entry.path);
			}
		}
		async function follow(entry) {
			while (!entry.dead) try {
				const since = bytesToBase64(entry.doc.oplogVersion().encode());
				const got = await deps.call("changes", {
					doc: entry.path,
					since,
					wait: waitMs
				});
				if (entry.dead) return;
				const update = base64ToBytes(got.update);
				if (update.length) entry.doc.import(update);
			} catch (error) {
				const code = error?.code;
				if (code === "locked" || code === "no_workspace") return;
				await sleep(2e3);
			}
		}
		return {
			/** Loro's classes (`LoroMap`, `LoroText`, ...), once the first document has loaded. */
			get Loro() {
				return loaded;
			},
			/**
			* A Loro document of the app's declared path, loaded from Rust's copy. A name of the form
			* `<app>:<doc>` opens another app's document read-only, if this app's manifest says
			* `uses "<app>" read`; Rust decides, and the library only passes the name through.
			*/
			async doc(path) {
				let entry = entries.get(path);
				if (!entry) {
					entry = load(path);
					entries.set(path, entry);
					entry.catch(() => entries.delete(path));
				}
				return (await entry).doc;
			},
			/** Whether this view may write the document (it opened it first, and the manifest allows it). */
			async writable(path) {
				await this.doc(path);
				return (await entries.get(path)).write;
			},
			/** Called when Rust refused an update and the document was put back in line. */
			onRefused(handler) {
				handlers.add(handler);
				return () => handlers.delete(handler);
			},
			/** The caller's display name and roles at this app. */
			async me() {
				return deps.call("me", {});
			}
		};
	}
	// src/entry.ts
	var base = "/.osvauld/";
	async function call(op, body) {
		let response;
		try {
			response = await fetch(base + op, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(body),
				cache: "no-store"
			});
		} catch {
			throw {
				code: "unavailable",
				message: "The app data service could not be reached."
			};
		}
		const reply = await response.json().catch(() => ({}));
		if (!response.ok) throw {
			code: reply.code ?? "failed",
			message: reply.message ?? "The request failed."
		};
		return reply;
	}
	var loading;
	globalThis.osvauld = Object.freeze(createOsvauld({
		call,
		loadLoro: () => loading ??= __wbg_init({ module_or_path: base + "loro.wasm" }).then(() => web_exports)
	}));
})();
