import MainLayout from "./MainLayout";
import AuthLayout from "./authLayout";

function Home() {
    return (
        <AuthLayout requiredRoles={["user"]}>
            <MainLayout title="Home">
                <div>Home</div>
            </MainLayout>
        </AuthLayout>
    );
}
export default Home;
