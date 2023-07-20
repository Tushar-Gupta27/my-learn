// GET cl-user/location/get-areas-localities

const json = {
  params: {
    city: 'GURGAON',
    search_term: '',
    // limit,
    // offset
  },

  // Areas found
  response: {
    city: 'GURGAON',
    contains_popular_areas: true,
    areas: [
      {
        is_popular,
        ...rest,
      },
      {
        is_popular,
        ...rest,
      },
      {
        is_popular,
        ...rest,
      },
    ],
  },
  // No areas found
  response: {
    city: 'GURGAON',
    contains_popular_areas: true,
    text_input: {
      icon: 'identifier',
      label: 'आपकी लोकैलिटी नहीं मिला',
      placeholder: 'लोकैलिटी लिख कर बताएं...',
    },
    areas: [],
  },

  deliveriesPickup: {
    customers: [],
    delayedCustomers: [
      {
        ...rest,
        delivery: [
          {
            ...rest,
            is_otp_enabled,
          },
        ],
      },
    ],
    completedCustomers: [],
    ...rest,
  },
};
