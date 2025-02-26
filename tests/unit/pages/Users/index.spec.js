import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UsersIndex from '@/pages/Users/index.vue'

// Mock the fetch function globally
global.fetch = jest.fn()

describe('UsersIndex', () => {
  let wrapper
  let mockUseCookie
  let mockUseRuntimeConfig

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Mock the useCookie function
    mockUseCookie = jest.fn().mockReturnValue({ value: 'mock-token' })

    // Create a mock for useRuntimeConfig
    mockUseRuntimeConfig = jest.fn().mockReturnValue({
      public: {
        apiBase: 'http://mock-api.com'
      }
    })

    // Mount the component
    wrapper = mount(UsersIndex, {
      global: {
        plugins: [createTestingPinia()],
        mocks: {
          useCookie: mockUseCookie,
          useRuntimeConfig: mockUseRuntimeConfig
        },
        stubs: {
          Headers: true,
          UserList: true,
          UserForm: true
        }
      }
    })
  })

  it('fetches users on mount', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        users: [
          { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', roles: ['admin'] }
        ]
      })
    }
    global.fetch.mockResolvedValueOnce(mockResponse)

    await flushPromises()

    expect(global.fetch).toHaveBeenCalledWith(
      'http://mock-api.com/api/v1/user',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
          Accept: 'application/json'
        })
      })
    )

    expect(wrapper.vm.userData.data).toEqual([
      { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' }
    ])
  })

  it('opens create user form when "Create New" button is clicked', async () => {
    await wrapper.find('button.primaryBtn').trigger('click')

    expect(wrapper.vm.userData.modelType).toBe('create')
    expect(wrapper.vm.userData.createEditModel).toBe(true)
  })

  it('calls addUser when saving a new user', async () => {
    const mockAddUserResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        user: { _id: '2', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', roles: ['user'] }
      })
    }
    global.fetch.mockResolvedValueOnce(mockAddUserResponse)

    wrapper.vm.userData.modelType = 'create'
    wrapper.vm.userData.modelData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com'
    }

    await wrapper.vm.saveModel({ preventDefault: jest.fn() })

    expect(global.fetch).toHaveBeenCalledWith(
      'http://mock-api.com/api/v1/user',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }),
        body: JSON.stringify(wrapper.vm.userData.modelData)
      })
    )

    await flushPromises()

    expect(wrapper.vm.userData.createEditModel).toBe(false)
  })

  it('calls editUser when saving an existing user', async () => {
    const mockEditUserResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        user: { _id: '1', firstName: 'John', lastName: 'Smith', email: 'john@example.com', roles: ['admin'] }
      })
    }
    global.fetch.mockResolvedValueOnce(mockEditUserResponse)

    wrapper.vm.userData.modelType = 'edit'
    wrapper.vm.userData.modelData = {
      _id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com'
    }

    await wrapper.vm.saveModel({ preventDefault: jest.fn() })

    expect(global.fetch).toHaveBeenCalledWith(
      'http://mock-api.com/api/v1/user/1',
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }),
        body: JSON.stringify(wrapper.vm.userData.modelData)
      })
    )

    await flushPromises()

    expect(wrapper.vm.userData.createEditModel).toBe(false)
  })

  it('calls deleteUser when delete function is triggered', async () => {
    const mockDeleteUserResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({})
    }
    global.fetch.mockResolvedValueOnce(mockDeleteUserResponse)

    await wrapper.vm.deleteUser('1')

    expect(global.fetch).toHaveBeenCalledWith(
      'http://mock-api.com/api/v1/user/1',
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token'
        })
      })
    )

    await flushPromises()
  })
})