const fs = require('fs');
const data = JSON.parse(fs.readFileSync('figma_nodes.json'));

function extractProperties(node) {
    let props = {
        name: node.name,
        type: node.type
    };

    if (node.layoutMode) {
        props.layout = node.layoutMode; // HORIZONTAL, VERTICAL
        props.justify = node.primaryAxisAlignItems;
        props.align = node.counterAxisAlignItems;
        props.gap = node.itemSpacing;
        props.pad = [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft];
    }
    
    if (node.type === 'TEXT') {
        props.text = node.characters;
        props.fontSize = node.style ? node.style.fontSize : null;
        props.fontWeight = node.style ? node.style.fontWeight : null;
        if (node.fills && node.fills[0] && node.fills[0].color) {
            let c = node.fills[0].color;
            props.color = `rgba(${Math.round(c.r*255)}, ${Math.round(c.g*255)}, ${Math.round(c.b*255)}, ${c.a})`;
        }
    }
    
    if (node.fills && node.fills.length > 0 && node.fills[0].type === 'SOLID' && node.type !== 'TEXT') {
        let c = node.fills[0].color;
        props.bgColor = `rgba(${Math.round(c.r*255)}, ${Math.round(c.g*255)}, ${Math.round(c.b*255)}, ${c.a})`;
    }
    if(node.strokes && node.strokes.length > 0 && node.strokes[0].type === 'SOLID') {
         let c = node.strokes[0].color;
         props.borderColor = `rgba(${Math.round(c.r*255)}, ${Math.round(c.g*255)}, ${Math.round(c.b*255)}, ${c.a})`;
         props.borderWidth = node.strokeWeight;
    }

    return props;
}

function printNode(node, depth = 0) {
    let indent = '  '.repeat(depth);
    console.log(indent + JSON.stringify(extractProperties(node)));
    if (node.children) {
        node.children.forEach(c => printNode(c, depth + 1));
    }
}

printNode(data);
