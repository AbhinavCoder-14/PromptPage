export default async function ErrorPage({
    searchParams,
}: {
    searchParams?: Promise<{ reason?: string }>;
}) {
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    const reason = resolvedSearchParams?.reason;

    return (
        <div className="flex min-h-svh items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-3">
                <p className="text-lg font-medium">Sorry, something went wrong</p>
                <p className="text-sm text-muted-foreground">
                    {reason ? reason : "The auth flow failed before a session could be created."}
                </p>
            </div>
        </div>
    );
}