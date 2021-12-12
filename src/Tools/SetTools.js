function getConst(o){
    return o.constructor.name
}

export default function eq(a, b) {
    const ac = getConst(a), bc = getConst(b);
    if(ac !== bc){
        return false
    }

    switch (ac) {
        case "Set":
            return eqSet(a,b);
        case "Array":
            return eqUList(a,b)
        case "Object":
            return eqObj(a,b)
        default:
            return a === b
    }
}


function eqSet(as, bs){
    return as.size === bs.size && all(has(bs), as)
}

function eqUList(aul, bul){
    return aul.length === bul.length && all(includes(bul), aul)
}

const obj_sort_comp = (a, b) => (a[0] > b[0] ? 1 : -1)
const get_sorted_entries = (obj) => (Object.entries(obj).sort(obj_sort_comp))

function eqObj(ao, bo){
    const ae = get_sorted_entries(ao)
    const be = get_sorted_entries(bo)

    return ae.length === be.length && ae.every(([akey, aprop], index) => {
        const [bkey, bprop] = be[index]
        return akey === bkey && eq(aprop, bprop)
    })




}

/// 
function all(pred, as) {
    for (var a of as) if (!pred(a)) return false;
    return true;
}

///

function has(source) {
    return function (a) {
        return source.has(a);
    };
}

function includes(source) {
    return function (a) {
        return source.includes(a);
    };
}
