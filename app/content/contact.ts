/** Contact form copy (7PA-244 voice pass — plain, direct, no gushing). */
export const CONTACT = {
  heading: 'Or use the form',
  intro: 'Email is fastest. The form works too.',
  fields: {
    name: { label: 'Name', placeholder: 'Name' },
    email: { label: 'Email', placeholder: 'Email' },
    phone: { label: 'Phone number', placeholder: 'Phone number (optional)' },
    message: { label: 'Comment', placeholder: 'What’s going on?' },
  },
  submitLabel: 'Send',
  successMessage: 'Sent. We’ll get back to you within 2 business days.',
} as const;
