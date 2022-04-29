import * as yup from 'yup';

function equalTo(ref, msg) {
  return this.test({
    name: 'equalTo',
    exclusive: false,
    message: msg || `${ref.path} must be the same as ${ref}`,
    params: {
      reference: ref.path,
    },
    test(value) {
      return value === this.resolve(ref);
    },
  });
}

yup.addMethod(yup.string, 'equalTo', equalTo);

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .required()
    .email()
    .ensure() // Transform into ''
    .matches(/.*\.edu.*/), // Check for .edu
  password: yup.string().required().min(8).max(99),
});

export const RegisterSchema = yup.object().shape({
  email: yup
    .string()
    .required()
    .email()
    .ensure() // Transform into ''
    .matches(/.*\.edu.*/), // Check for .edu,
  confirmPassword: yup
    .string()
    .required()
    .min(8)
    .max(30)
    .equalTo(yup.ref('password')),
  confirmEmail: yup
    .string()
    .required()
    .email()
    .ensure() // Transform into ''
    .matches(/.*\.edu.*/)
    .equalTo(yup.ref('email')),
  password: yup.string().required().min(8).max(30),
});

export const RegisterEmail = yup.object().shape({
  email: yup
    .string()
    .required()
    .email()
    .ensure() // Transform into ''
    .matches(/.*\.edu.*/),
});
export const OTPSchema = yup.object().shape({
  code: yup.string().required().length(6),
});

export const RegisterPassword = yup.object().shape({
  password: yup.string().required().min(8).max(99),
});

export const ExpandedCardConversationInput = yup.object().shape({
  conversation: yup.string().required().min(8).max(200).ensure(),
});

export const QuestionCreatorInput = yup.object().shape({
  question: yup.string().required().min(8).max(200).ensure(),
});
export const ChangePasswordSchema = yup.object().shape({
  password: yup.string().required().min(8).max(99),
  confirmPassword: yup
    .string()
    .required()
    .min(8)
    .max(99)
    .equalTo(yup.ref('password')),
});

export const GroupSchema = yup.object().shape({
  groupDescription: yup.string().required().max(100),
  groupName: yup.string().required().ensure().min(3).max(50),
});

export const SetupSchema = yup.object().shape({
  name: yup.string().required().ensure(),
  personality: null,
  hometown: null,
  interests: null,
  major: null,
  username: null,
});

export const ReportSchema = yup.object().shape({
  report: yup.string().min(3).max(300).required().ensure(),
});

export const MessageSchema = yup.object().shape({
  message: yup.string().min(1).max(300).required().ensure(),
});
