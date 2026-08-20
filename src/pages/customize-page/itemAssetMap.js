const ITEM_ASSET_MAP = {}

export function getItemAsset(assetKey) {
  return ITEM_ASSET_MAP[assetKey] ?? null
}
