/**
 * editor.js - Quill Rich Text Editor helper
 */

const Editor = {
    init(elementId, options = {}) {
        const element = document.querySelector(`#${elementId}`);
        if (!element) return null;

        const defaultOptions = {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'blockquote', 'code-block'],
                    ['clean']
                ]
            },
            ...options
        };

        const quill = new Quill(element, defaultOptions);
        return quill;
    },

    getContent(quill) {
        return quill.root.innerHTML;
    },

    setContent(quill, html) {
        quill.root.innerHTML = html;
    }
};
