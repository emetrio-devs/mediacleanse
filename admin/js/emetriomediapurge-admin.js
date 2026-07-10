(function($){
    // Method 1: Modify the Backbone script template before initialization
    function patchAttachmentTemplate(){
        var $template = $('#tmpl-attachment');
        if ($template.length) {
            var html = $template.html();
            if (html && html.indexOf('emetriomediapurge-unused-item') === -1) {
                html = html.replace(
                    'class="attachment-preview',
                    'class="attachment-preview <# if ( data.is_unused ) { #>emetriomediapurge-unused-item<# } #>'
                );
                $template.html(html);
            }
        }
    }
    
    // Method 2: Fallback direct prototype override (targeting .attachment-preview)
    function initEmetrioMediaPurgeGrid() {
        if (typeof wp !== 'undefined' && wp.media && wp.media.view && wp.media.view.Attachment) {
            var originalRender = wp.media.view.Attachment.prototype.render;
            wp.media.view.Attachment.prototype.render = function() {
                originalRender.apply(this, arguments);
                if (this.model.get('is_unused')) {
                    this.$el.find('.attachment-preview').addClass('emetriomediapurge-unused-item');
                    this.$el.attr('title', EmetrioMediaPurgeL10n.unusedText );
                }
            };

            if (wp.media.view.Attachment.Library) {
                var originalLibRender = wp.media.view.Attachment.Library.prototype.render;
                wp.media.view.Attachment.Library.prototype.render = function() {
                    originalLibRender.apply(this, arguments);
                    if (this.model.get('is_unused')) {
                        this.$el.find('.attachment-preview').addClass('emetriomediapurge-unused-item');
                        this.$el.attr('title', EmetrioMediaPurgeL10n.unusedText );
                    }
                };
            }
            return true;
        }
        return false;
    }

    // Execute immediately and on document ready
    patchAttachmentTemplate();
    initEmetrioMediaPurgeGrid();

    $(document).ready(function(){
        patchAttachmentTemplate();
        initEmetrioMediaPurgeGrid();
    });

    // Polling fallback to capture late-loading scripts
    var attempts = 0;
    var interval = setInterval(function(){
        attempts++;
        patchAttachmentTemplate();
        if (initEmetrioMediaPurgeGrid() || attempts > 30) clearInterval(interval);
    }, 100);
})(jQuery);