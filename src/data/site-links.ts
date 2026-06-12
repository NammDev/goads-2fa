/** UTM-tagged GOADS links — one distinct utm_content per funnel touchpoint. */

type GoadsContent = "header" | "footer" | "banner_left" | "banner_bottom"

export function goadsUrl(content: GoadsContent): string {
  return `https://goadsagency.com/?utm_source=2fa-media&utm_medium=referral&utm_campaign=2fa-tool&utm_content=${content}`
}
