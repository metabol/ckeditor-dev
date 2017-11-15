/* bender-tags: inlinetoolbar,context */
/* bender-ckeditor-plugins: inlinetoolbar,button,widget */
/* bender-include: ../../widget/_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'div[*];strong'
		}
	};

	bender.test( {
		init: function() {
			// Stub listener register method, as since it's called in a constructor and it adds
			// selectionChange listener, it causes extra calls to toolbar hide/show methods.
			sinon.stub( CKEDITOR.plugins.inlinetoolbar.context.prototype, '_attachListeners' );
		},

		'test simple positive matching with one item': function() {
			var editor = this.editor,
				context = this._getContextStub( [ 'positive' ] );

			editor.widgets.add( 'positive' );

			this.editorBot.setData(
				'<p>foo</p><div data-widget="positive" id="w1">foo</div></p>',
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					context.refresh();

					assert.areSame( 0, context.toolbar.hide.callCount, 'Toolbar hide calls' );
					assert.areSame( 1, context.toolbar.show.callCount, 'Toolbar show calls' );
				} );
		},

		'test simple positive matching with multiple items': function() {
			var editor = this.editor,
				context = this._getContextStub( [ 'foo', 'bar', 'baz' ] );

			editor.widgets.add( 'bar' );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'simpleWidget' ).getHtml(),
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					context.refresh();

					assert.areSame( 0, context.toolbar.hide.callCount, 'Toolbar hide calls' );
					assert.areSame( 1, context.toolbar.show.callCount, 'Toolbar show calls' );
				} );
		},

		'test simple mismatching with few items': function() {
			var editor = this.editor,
				context = this._getContextStub( [ 'foo', 'bar', 'baz', 'nega', 'negative-postfix' ] );

			editor.widgets.add( 'negative' );

			this.editorBot.setData(
				'<p>foo</p><div data-widget="negative" id="w1">foo</div></p>',
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					context.refresh();

					assert.areSame( 1, context.toolbar.hide.callCount, 'Toolbar hide calls' );
					assert.areSame( 0, context.toolbar.show.callCount, 'Toolbar show calls' );
				} );
		},

		'test matching with options.widgets as a string': function() {
			var editor = this.editor,
				context = this._getContextStub( 'foo,bar,baz' );

			editor.widgets.add( 'bar' );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'simpleWidget' ).getHtml(),
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					context.refresh();

					assert.areSame( 0, context.toolbar.hide.callCount, 'Toolbar hide calls' );
					assert.areSame( 1, context.toolbar.show.callCount, 'Toolbar show calls' );
				} );
		},

		'test negation with options.widgets as a string': function() {
			var editor = this.editor,
				context = this._getContextStub( 'foo,zbarz,baz' );

			editor.widgets.add( 'bar' );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'simpleWidget' ).getHtml(),
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					context.refresh();

					assert.areSame( 1, context.toolbar.hide.callCount, 'Toolbar hide calls' );
					assert.areSame( 0, context.toolbar.show.callCount, 'Toolbar show calls' );
				} );
		},

		'test widget selector does not trigger in nested editable': function() {
			var editor = this.editor,
				context = this._getContextStub( 'widgetWithEditable' );

			editor.widgets.add( 'widgetWithEditable', {
				editables: {
					area: 'div.area'
				}
			} );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'withCaption' ).getHtml(),
				function() {
					this.editor.getSelection().selectElement( this.editor.editable().findOne( 'strong' ) );

					context.refresh();

					assert.areSame( 1, context.toolbar.hide.callCount, 'Toolbar hide calls' );
					assert.areSame( 0, context.toolbar.show.callCount, 'Toolbar show calls' );
				} );
		},

		/*
		 * Returns a Context instance with toolbar show/hide methods stubbed.
		 *
		 * @param {String[]} widgetNames List of widget names to be set as `options.widgets`.
		 * @returns {CKEDITOR.plugins.inlinetoolbar.context}
		 */
		_getContextStub: function( widgetNames ) {
			var ret = this.editor.plugins.inlinetoolbar.create( {
				widgets: widgetNames
			} );

			sinon.stub( ret.toolbar, 'hide' );
			sinon.stub( ret.toolbar, 'show' );

			return ret;
		}
	} );
} )();