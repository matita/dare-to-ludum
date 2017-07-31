export default function textBuilder(txt, text = '', defaultColor = '#000') {
    var texts = [];
    var textLength = 0;

    var me = {
        add: function(text, color = defaultColor) {
            texts.push(text);
            txt.addColor(color, textLength)
            textLength += text.length;
            txt.addColor(defaultColor, textLength);
            return me;
        },

        write: function () {
            txt.text = texts.join('');
            return me;
        }
    };

    me.add(text, defaultColor);

    return me;
}