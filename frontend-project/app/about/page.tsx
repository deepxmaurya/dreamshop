import AuthGuard from "../components/AuthGuard";
export default function About() {
    return (
        <AuthGuard>
        <main className="min-h-screen bg-gray-100 p-10">
            <h1 className="mt-10 text-4xl font-bold text-center">
                About Us
            </h1>

            <p className="mt-4 text-lg">
                Welcome to our website.
            </p>

            <p className="mt-2 ">
                This website is devlop by deepak maurya.
            </p>
        </main>
    </AuthGuard>
    );
}