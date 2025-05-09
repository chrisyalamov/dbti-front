/**
 * This is a helper function used to extract the first error that applies to a
 * specific field from the result of a zod validation.
 * 
 * It is usually helpful when you have validated the data submitted by a form
 * and wish to display the error message relevant to a specific field.
 * 
 * @param res The result of the validation (zod output)
 * @param fieldName The name of the field to look for errors for
 * @returns The first error for the field, or false if no error is found
 */
export const findErrorsForField = (res: any, fieldName: string) => {
  console.log("received", JSON.stringify(res))
  try {
    console.log("FOUND")
    return res?.issues?.find((issue: any) => issue.path[0] === fieldName)
  } catch {
    return false
  }
}
