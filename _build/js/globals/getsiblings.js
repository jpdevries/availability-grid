var getSiblings = function ( elem ) { // https://gomakethings.com/ditching-jquery/#get-sibling-elements
    var siblings = [];
    var sibling = elem.parentNode.firstChild;
    for ( ; sibling; sibling = sibling.nextSibling ) {
        if ( sibling.nodeType === 1 && sibling !== elem ) {
            siblings.push( sibling );
        }
    }
    return siblings;
};

exports.getSiblings = getSiblings;
