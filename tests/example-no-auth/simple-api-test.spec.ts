import { StatusCodes } from 'http-status-codes'
import { expect, test } from '@playwright/test'

test.describe('GET /product/{id}', () => {
  test('get product with correct id should receive code 200', async ({ request }) => {
    // Build and send a GET request to the server
    const response = await request.get('https://shop.tl-academy.ee/api/products/1')

    const statusCode = response.status()
    expect(statusCode).toBe(StatusCodes.OK)
  })

  test('get product with correct id should receive code 404', async ({ request }) => {
    const allProductResponse = await request.get('https://shop.tl-academy.ee/api/products')
    const allProductBody = await allProductResponse.json()
    const lastProductId: number = allProductBody.length

    const oneProductResponse = await request.get(
      'https://shop.tl-academy.ee/api/products/' + lastProductId + 1,
    ) // + 1 req
    const oneProductStatusCode = oneProductResponse.status()

    expect(oneProductStatusCode).toBe(StatusCodes.NOT_FOUND)
  })

  test('get product with incorrect id should receive code 400', async ({ request }) => {
    // Build and send a GET request to the server
    const response = await request.get('https://shop.tl-academy.ee/api/products/q1231wefqwef1232')

    const statusCode = response.status()

    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
  })

  test('get product with negative id should receive code 400', async ({ request }) => {
    const response = await request.get('https://shop.tl-academy.ee/api/products/-1')

    const statusCode = response.status()

    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
  })

  test('get product with incorrect id with number first should receive code 400', async ({
    request,
  }) => {
    const response = await request.get('https://shop.tl-academy.ee/api/products/1fewfwefwef')

    const statusCode = response.status()

    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
  })
})

test('post product with correct data should receive code 201', async ({ request }) => {
  // prepare request body
  const requestBody = {
    name: 'Orange',
    category: 'Fruit',
    price: 2.39,
    quantity: 10,
  }
  // Send a POST request to the server
  const response = await request.post('https://shop.tl-academy.ee/api/products', {
    data: requestBody,
  })
  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  expect(statusCode).toBe(StatusCodes.CREATED)
  // check that body.name is string type
  expect(typeof responseBody.name).toBe('string')
  // check that body.price is number type
  expect(typeof responseBody.price).toBe('number')
})
