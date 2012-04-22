(function($) {

  /**
   * This adds a Chosen style selector for the tree select widget.
   *
   * This widget requires chosen.css.
   */
  $.fn.chosentree = function(params) {

    // Setup the default parameters.
    params = $.extend({
      inputId: 'chosentree-select',  /** The input element ID and NAME. */
      width: 450,                    /** The width of this widget. */
      title: '',                     /** The title to add to the input. */
      description: '',               /** The description to add to the input. */
      default_text: 'Select Item',   /** The default text within the input. */
      loaded: null,                  /** Called when all items are loaded. */
      collapsed: true                /** If the tree should be collapsed. */
    }, params);

    // Iterate through each instance.
    return $(this).each(function() {

      // Keep track of the treeselect.
      var selector = null;
      var choices = null;
      var search = null;
      var input = null;
      var title = null;
      var description = null;
      var treeselect = null;
      var treewrapper = null;
      var selectedTimer = 0;

      // Show or hide the tree.
      function showTree(show, tween) {
        tween = tween || 'fast';
        if (show) {
          treewrapper.addClass('treevisible').show('fast');
        }
        else {
          treewrapper.removeClass('treevisible').hide('fast');
        }
      }

      // Create the selector element.
      selector = $(document.createElement('div'));
      selector.addClass('chzn-container chzn-container-multi');

      // Create the choices.
      choices = $(document.createElement('ul'));
      choices.addClass('chzn-choices chosentree-choices');

      // Create the search element.
      search = $(document.createElement('li'));
      search.addClass('search-field');

      // If they wish to have a title.
      title = $(document.createElement('label'));
      title.attr({
        'for': params.inputId
      });
      title.text(params.title);

      // If they wish to have a description.
      description = $(document.createElement('div'));
      description.attr({
        'class': 'description'
      });
      description.text(params.description);

      // Create the input element.
      input = $(document.createElement('input'));
      input.attr({
        'type': 'text',
        'name': params.inputId,
        'id': params.inputId,
        'value': params.default_text,
        'class': 'default',
        'autocomplete': 'off'
      });
      input.css('width', '100%');
      input.focus(function(event) {
        showTree(true);
      });

      // Creat the chosen selector.
      selector.append(title).append(choices.append(search.append(input)));

      treewrapper = $(document.createElement('div'));
      treewrapper.addClass('treewrapper');
      treewrapper.css('width', params.width + 'px');
      treewrapper.hide();

      // Get the tree select.
      treeselect = $(document.createElement('div'));
      treeselect.addClass('treeselect');

      // Setup the keyevents.
      $(this).keyup(function(event) {
        if (event.which == 27) {
          showTree(false);
        }
      });

      // Add the treeselect widget.
      $(this).append(selector.append(treewrapper.append(treeselect)));

      // Add the description.
      $(this).append(description);

      // Now declare the treeselect.
      var treeparams = params;

      // Reset the selected callback.
      treeparams.selected = (function(chosentree) {
        return function(node, root) {
          if (node.checked) {

            // Get and add a new choice.
            var choice = $(document.createElement('li'));
            choice.addClass('search-choice');
            choice.attr('id', 'choice_' + node.id);

            // Add the node data to this choice.
            choice.eq(0)[0].nodeData = node;

            var span = $(document.createElement('span'));
            span.text(node.title);

            var close = $(document.createElement('a'));
            close.addClass('search-choice-close');
            close.attr('href', 'javascript:void(0)');

            // Bind when someone clicks on the close button.
            close.bind('click', function(event) {

              // Prevent the default.
              event.preventDefault();

              // Remove the choice.
              $('li#choice_' + node.id, choices).remove();

              // Deselect this node.
              node.select(false);
            });

            // Add this to the choices.
            search.before(choice.append(span).append(close));
          }
          else {

            // If not selected, then remove the choice.
            $('li#choice_' + node.id, choices).remove();
          }

          // Make sure we don't do this often for performance.
          if (root) {

            // Get all of the nodes that are selected.
            var nodes = [];
            chosentree.value = {};

            // Show the choices.
            choices.show();

            // Add the selected items to the choices.
            $('li.search-choice', choices).each(function() {
              chosentree.value[this.nodeData.id] = this.nodeData.value;
              nodes.push(this.nodeData);
            });

            // Show more or less.
            if (jQuery.fn.moreorless) {

              // Add this to the choices.
              choices.moreorless(100, '+' + nodes.length + ' more');
            }

            // If they wish to know when it is loaded.
            if (treeparams.loaded) {

              // Call our callback with all the nodes.
              treeparams.loaded(nodes);
            }

            // Trigger an event.
            $(chosentree).trigger('treeloaded');
          }
        };
      })(this);

      // Now declare our treeselect control.
      $(treeselect).treeselect(treeparams);

      // Show the tree by default.
      if (!treeparams.collapsed) {
        choices.hide();
        showTree(true, null);
      }
    });
  };
})(jQuery);