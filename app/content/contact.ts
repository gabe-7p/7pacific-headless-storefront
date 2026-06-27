/** Contact page copy (typed constants), mirroring the live page.contact content. */
export const CONTACT = {
  heading: 'Get in touch',
  intro: 'Want to learn more about 7Pacific? Drop us a line to stay in touch.',
  fields: {
    name: { label: 'Name', placeholder: 'Name' },
    email: { label: 'Email', placeholder: 'Email' },
    phone: { label: 'Phone number', placeholder: 'Phone number (optional)' },
    message: { label: 'Comment', placeholder: 'How can we help?' },
  },
  submitLabel: 'Send',
  successMessage: 'Thanks for reaching out — we’ll get back to you soon.',
} as const;
