function index(element){
    var sib = element.parentNode.childNodes;
    var n = 0;
    for (var i=0; i<sib.length; i++) {
         if (sib[i]==element) return n;
         if (sib[i].nodeType==1) n++;
    }
    return -1;
}

module.exports = index;
