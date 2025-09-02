import z from 'zod';

export const changePasswordDto = z
  .object({
    newPassword: z
      .string({
        invalid_type_error: 'New password must be a string',
      })
      .nonempty('Please enter your new password'),
    confirmNewPassword: z
      .string({
        invalid_type_error: 'New password must be a string',
      })
      .nonempty('Please re-enter your new password'),
    code: z
      .string({
        invalid_type_error: 'Code must be a string',
      })
      .nonempty('Please enter your verification code'),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Your passwords do not match.',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordDto = z.infer<typeof changePasswordDto>;
