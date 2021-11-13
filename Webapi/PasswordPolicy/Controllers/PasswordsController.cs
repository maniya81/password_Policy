using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PasswordPolicy.Data;
using PasswordPolicy.Dtos;
using PasswordPolicy.EmailService;
using PasswordPolicy.Models;
using System;
using System.Collections.Generic;

namespace PasswordPolicy.Controllers
{
    //[Authorize]
    [Route("api/passwords")]
    [ApiController]
    public class PasswordsController : ControllerBase
    {
        private readonly IPasswordRepo _repo;
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;

        public PasswordsController(IPasswordRepo repo, IMapper mapper, IEmailSender emailSender)
        {
            _repo = repo;
            _emailSender = emailSender;
            _mapper = mapper;
        }


        //GET api/passwords/
        [HttpGet]
        public ActionResult<IEnumerable<Password>> GetAllPasswords()
        {
            var passwordpolicies = _repo.GetAllPasswords();
            return Ok(passwordpolicies);
        }


        //GET api/passwords/GetAppliedPasswordPolicy
        [AllowAnonymous]
        [Route("GetAppliedPasswordPolicy")]
        [HttpGet]
        public ActionResult<PasswordDto> GetAppliedPasswordPolicy()
        {
            var passwordpolicies = _repo.GetAppliedPasswordPolicyId();
            return Ok(passwordpolicies);
        }

        //GET api/passwords/{id}
        [HttpGet("{id}", Name = "GetPasswordsById")]
        public ActionResult<PasswordDto> GetPasswordsById(int id)
        {
            var passwordpolicy = _repo.GetPasswordById(id);
            if (passwordpolicy != null)
            {
                return Ok(_mapper.Map<PasswordDto>(passwordpolicy));
            }
            return NotFound();

        }

        //post api/passwords
        [HttpPost]
        public ActionResult<PasswordDto> CreatePassword(PasswordDto passwordDto)
        {
            var passwordModel = _mapper.Map<Password>(passwordDto);
            passwordModel.DateAdded = DateTime.Now;

            if (passwordDto.IsApplied == true)
            {
                var allPasswords = _repo.GetAllPasswords();
                foreach (var item in allPasswords)
                {
                    item.IsApplied = false;
                    _repo.UpdatePassword(item);
                }
            }
            _repo.CreatePassword(passwordModel);
            _repo.SaveChanges();
            var passwordReadDto = _mapper.Map<PasswordDto>(passwordModel);

            return CreatedAtRoute(nameof(GetPasswordsById), new { Id = passwordReadDto.Id }, passwordReadDto);
        }

        //put api/passwords/{id}
        [HttpPut("{id}")]
        public ActionResult UpdatePassword(int id, PasswordDto passwordDto)
        {
            var passwordModelFromRepo = _repo.GetPasswordById(id);
            if (passwordModelFromRepo == null)
            {
                return NotFound();
            }


            _mapper.Map(passwordDto, passwordModelFromRepo);
            passwordModelFromRepo.DateUpdated = DateTime.Now;
            if (passwordDto.IsApplied == true)
            {
                var allPasswords = _repo.GetAllPasswords();
                foreach (var item in allPasswords)
                {
                    item.IsApplied = false;
                    _repo.UpdatePassword(item);
                }
            }
            _repo.UpdatePassword(passwordModelFromRepo);

            _repo.SaveChanges();

            return NoContent();
        }

        //DELETE api/passwords/{id}
        [HttpDelete("{id}")]
        public ActionResult DeletePassword(int id)
        {
            var passwordModelFromRepo = _repo.GetPasswordById(id);
            if (passwordModelFromRepo == null)
            {
                return NotFound();
            }
            _repo.DeletePassword(passwordModelFromRepo);
            _repo.SaveChanges();

            return Ok("deleted Key");
        }
    }
}
