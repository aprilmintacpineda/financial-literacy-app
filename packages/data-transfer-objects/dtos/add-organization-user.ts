import z from 'zod';

export const addOrganizationUserDto = z.object({
  userId: z.string().nonempty(),
  organizationId: z.string().nonempty(),
});

export type AddOrganizationUserDto = z.infer<
  typeof addOrganizationUserDto
>;
