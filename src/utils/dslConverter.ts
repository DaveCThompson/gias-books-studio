/**
 * Converts DSL tags to TipTap-compatible HTML
 */
export function dslToHtml(text: string): string {
    return text
        .replace(
            /\[expressive:(\w+)\](.*?)\[\/expressive\]/g,
            '<span data-expressive="true" data-style="$1">$2</span>'
        )
        .replace(
            /\[interactive:([^\]]+)\](.*?)\[\/interactive\]/g,
            '<span data-interactive="true" data-tooltip="$1">$2</span>'
        )
        .replace(/\n/g, '<br>');
}

/**
 * Converts TipTap HTML back to DSL tags
 */
export function htmlToDsl(html: string): string {
    return html
        .replace(
            /<span data-expressive="true" data-style="(\w+)">(.*?)<\/span>/g,
            '[expressive:$1]$2[/expressive]'
        )
        .replace(
            /<span data-interactive="true" data-tooltip="([^"]+)">(.*?)<\/span>/g,
            '[interactive:$1]$2[/interactive]'
        )
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<p>(.*?)<\/p>/g, '$1\n')
        .replace(/<[^>]+>/g, '') // Strip remaining HTML
        .trim();
}
