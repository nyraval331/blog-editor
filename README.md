This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Blog Application

This project is a blog application built using React, Next.js, and Firebase for data storage. It allows users to create, edit, delete, and list blog posts. The application is designed to be responsive and works well on various screen sizes.

## Functionality

- **Add New Blog Posts**: Users can create new blog posts with a title, content, and optional images.
- **Edit Blog Posts**: Users can edit existing blog posts.
- **Delete Blog Posts**: Users can delete blog posts.
- **List Blog Posts**: Users can view a list of all blog posts with options to view, edit, or delete each post.
- **Responsive Design**: The blog section is responsive and works well on various screen sizes.

## Project Setup

### Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm.
- You have a Firebase project set up for data storage.

## Getting Started

1. **Clone the Repository**

    ```sh
    git clone https://github.com/your-repository-url.git
    cd your-repository-name
    ```

2. **Install Dependencies**

    ```sh
    npm install
    ```

3. **Setup Environment Variables**

    - Create a `.env.local` file in the root directory of your project and add the necessary environment variables for your Firebase configuration. Example:

        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
        NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
        ```

4. **Build the Project**

    ```sh
    npm run build
    ```

5. **Start the Project**

    ```sh
    npm run start
    ```


to, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
