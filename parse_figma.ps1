$json = Get-Content 'C:\Users\db\.mcp-figma\cache\file_nodes_bMMxEq96QJKBvUeeLPUXWJ_1773027309609.json' -Raw | ConvertFrom-Json
function Extract-Text($node) {
    if ($node.characters -ne $null) {
        Write-Output ($node.characters)
    }
    if ($node.children -ne $null) {
        foreach ($child in $node.children) {
            Extract-Text $child
        }
    }
}
foreach ($prop in $json.nodes.psobject.properties) {
    Extract-Text $prop.Value.document
}
