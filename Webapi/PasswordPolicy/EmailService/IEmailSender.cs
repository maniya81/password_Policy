namespace PasswordPolicy.EmailService
{
    public interface IEmailSender
    {
        void SendEmail(Message message);
    }
}
