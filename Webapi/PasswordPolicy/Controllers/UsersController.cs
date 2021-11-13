using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PasswordPolicy.Data;
using PasswordPolicy.Dtos;
using PasswordPolicy.EmailService;
using PasswordPolicy.Helpers;
using PasswordPolicy.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PasswordPolicy.Controllers
{
    //[Authorize]
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUserRepo _userRepo;
        private IMapper _mapper;
        private readonly IEmailSender _emailsender;
        private readonly IPasswordRepo _password;
        private readonly AppSettings _appSettings;

        public UsersController(
            IUserRepo userRepo,
            IMapper mapper,
            IOptions<AppSettings> appSettings,
            IEmailSender emailSender,
            IPasswordRepo password)
        {
            _userRepo = userRepo;
            _mapper = mapper;
            _emailsender = emailSender;
            _password = password;
            _appSettings = appSettings.Value;
        }

        //Post api/users/isEmailExists
        [Route("isEmailExists")]
        [HttpPost]
        public bool IsEmailExists([FromBody] UserDto userParam)
        {
            return _userRepo.IsEmailIdExist(userParam.EmailId);
        }

        //Post  api/users/validatetoken
        [Route("validatetoken")]
        [HttpPost]
        public bool ValidateResetToken([FromBody] ValidateResetTokenDto userParam)
        {
            return _userRepo.ValidateResetToken(userParam);
        }

        //Post api/users/authenticate
        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] UserDto userParam)
        {
            var user = _userRepo.Authenticate(userParam.EmailId, userParam.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            if (_userRepo.IsPasswordExpired(userParam.EmailId))
                return BadRequest(new { message = "Password is Expired" });

            //Set Token Expire Time
            var appliedPasswordPoliocy = _password.GetAppliedPasswordPolicyId();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.Now.AddMinutes(appliedPasswordPoliocy.SessionTimeoutInterval),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
           

            //send email
            //var message = new Message(new string[] { user.EmailId }, "Log In Notification", "Someone logged into your account");
            //_emailsender.SendEmail(message);

            // return basic user info and authentication token
            return Ok(new UserDto()
            {
                Id = user.Id,
                EmailId = user.EmailId,
                Name = user.Name,
                Token = tokenString,
                TokenExpiresTime = DateTime.Now.AddMinutes(appliedPasswordPoliocy.SessionTimeoutInterval-1).AddSeconds(55)
            });
        }

        //Post api/users/changepassword
        [HttpPost("changepassword")]
        public IActionResult ChangePasswordPassword(ChangePasswordDto model)
        {
            var user = _userRepo.Authenticate(model.EmailId, model.OldPassword);

            if (user == null)
                return BadRequest(new { message = "old password is incorrect" });

            _userRepo.ChangePassword(model);

            return Ok(new { message = "Password changed sucessfully" });
        }


        //Post api/users/forgotpassword
        [HttpPost("forgotpassword")]
        public IActionResult ForgotPassword(ForgotPasswordDto model)
        {
            _userRepo.ForgotPassword(model);
            return Ok(new { message = "Please check your email for password reset instructions" });
        }
        //Post api/users/resetpassword
        [HttpPost("resetpassword")]
        public IActionResult ResetPassword(ResetPasswordDto model)
        {
            _userRepo.ResetPassword(model);
            return Ok(new { message = "Password reset successful, you can now login" });
        }

        //api/users/register
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserDto userParam)
        {
            // map model to entity
            var user = _mapper.Map<User>(userParam);

            try
            {
                // create user
                _userRepo.Create(user, userParam.Password);
                return Ok(new { message = "Success" });
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }
        //api/users/
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _userRepo.GetAll();
            var model = _mapper.Map<IList<UserDto>>(users);
            return Ok(model);
        }
        //api/users/2
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _userRepo.GetById(id);
            var model = _mapper.Map<UserDto>(user);
            return Ok(model);
        }
        //api/users/1
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UserDto userParam)
        {
            // map model to entity and set id
            var user = _mapper.Map<User>(userParam);
            user.Id = id;

            try
            {
                // update user 
                _userRepo.Update(userParam);
                return Ok();
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }
        //api/users/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _userRepo.Delete(id);
            return Ok();
        }
    }
}
