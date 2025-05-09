import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/landing')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className='p-5 max-w-[80ch] mx-auto'>
        <h1 className='text-2xl font-semibold mt-6 mb-3'>
            Assessor homepage
        </h1>
        <p className='my-2 opacity-80'>
            This page provides details on the the tech stack used for this assignment.
        </p>
        <h2 className='text-xl font-medium mt-6 mb-3'>
            Infrastructure
        </h2>
        <p className='my-2 opacity-80'>
            My solution comprises of a database (PostgreSQL), a backend (API built using .NET Core) and a frontend (SPA built using React). The frontend interfaces with the backend via TanStack Router— the library used for routing. The API connects to the database using Entity Framework Core.
        </p>
        <h3 className='text-lg mt-6 mb-3'>Frontend</h3>
        <p className='my-2 opacity-80'>
            The frontend is a single-page application (SPA) built using React. Since React does not include routing capavilities out-of-the-box, I went with TanStack Router. Vite is used for building and bundling the frontend.
        </p>
    </div>
}
