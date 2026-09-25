import { APPROVED_IMAGES } from '../approved-images.js'

export const PLACEHOLDER_IMAGE = APPROVED_IMAGES.placeholder

export function recipeImageUrl(recipe) {
  return recipe?.coverImageUrl || PLACEHOLDER_IMAGE
}
