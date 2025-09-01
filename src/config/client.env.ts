interface ClientEnv {
  CDP_PROJECT_ID: string;
}

function validateClientEnv(): ClientEnv {
  const cdpProjectId = process.env.NEXT_PUBLIC_CDP_PROJECT_ID;

  if (!cdpProjectId) {
    throw new Error('NEXT_PUBLIC_CDP_PROJECT_ID is required');
  }

  return {
    CDP_PROJECT_ID: cdpProjectId,
  };
}

export const clientEnv = validateClientEnv();
