using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using PasswordPolicy.Data;
using PasswordPolicy.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using DevExpress.XtraReports.UI;
using System.Linq;
using PasswordPolicy.EmailService;
using System.Net.Mail;
using System.Net;

namespace PasswordPolicy.Controllers
{
    //[Authorize]
    [Route("api/documents")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        //private readonly string[] ACCEPTED_FILE_TYPES = new[] { ".jpg", ".jpeg", ".png" };
        private readonly IMapper _mapper;
        private readonly IDocumentRepo _document;
        private readonly IWebHostEnvironment _host;
        private readonly EmailConfiguration _emailConfig;

        public DocumentsController(IDocumentRepo documentRepo, IWebHostEnvironment host, IMapper mapper, EmailConfiguration emailConfig)
        {
            _document = documentRepo;
            _host = host;
            _mapper = mapper;
            _emailConfig = emailConfig;
        }
        //Post api/documents/
        [HttpPost]
        public async Task<IActionResult> UploadDocument([FromForm] IFormFile file)
        {

            if (file == null) return BadRequest("Null file");
            if (file.Length == 0) return BadRequest("Empty file");


            var uploadsFolderPath = Path.Combine(_host.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolderPath))
                Directory.CreateDirectory(uploadsFolderPath);

            var fileName = Guid.NewGuid().ToString() + "-" + Path.GetFileName(file.FileName);
            var filePath = Path.Combine(uploadsFolderPath, fileName);


            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var document = new Document()
            {
                FileName = fileName,
                FilePath = filePath,
                FileSize = file.Length,
                FileExtension = Path.GetExtension(file.FileName),
            };
            _document.CreateDocument(document);


            return Ok(new { message = "Success" });
        }

        //GET api/documents/
        [HttpGet]
        public ActionResult<IEnumerable<Document>> GetAllDocuments()
        {
            var docs = _document.GetAll();
            foreach (var doc in docs)
            {
                doc.FileName = doc.FileName.Substring(37);
            }
            return Ok(docs);
        }

        //get /api/documents/5
        [HttpGet("{id}", Name = "GetDocumentById")]
        public async Task<ActionResult> GetDocumentByIdAsync(int id)
        {
            var doc = _document.GetById(id);
            if (doc != null)
            {
                var uploads = Path.Combine(_host.WebRootPath, "uploads");
                var filePath = Path.Combine(uploads, doc.FileName);
                if (!System.IO.File.Exists(filePath))
                    return NotFound();

                var memory = new MemoryStream();
                using (var stream = new FileStream(filePath, FileMode.Open))
                {
                    await stream.CopyToAsync(memory);
                }
                memory.Position = 0;
                doc.FileName = doc.FileName.Substring(37);

                var result = File(memory, GetContentType(filePath), doc.FileName);
                result.FileDownloadName = doc.FileName;
                return result;
            }
            else
            {
                return StatusCode(404);
            }
        }


        //generate pdf from repx file and send email
        //get /api/documents/GetById/5
        [HttpGet("GetdocById", Name = "GetDocument")]
        public ActionResult GetDocumentsByIdAsync()
        {
            List<MemoryStream> list = new List<MemoryStream>();
            MailMessage mail = new MailMessage();
            var uploads = Path.Combine(_host.WebRootPath, "uploads");
            MemoryStream stream = new MemoryStream();
            XtraReport report = null;
            string reportName = "test9";
            var filePath = Path.Combine(uploads, reportName +".pdf");


            //generate pdf for the email
            if (Directory.EnumerateFiles(uploads).
            Select(Path.GetFileName).Contains(reportName+ ".repx"))
            {
                byte[] reportBytes = System.IO.File.ReadAllBytes(
                                    Path.Combine(uploads, reportName+".repx"));
                using (MemoryStream ms = new MemoryStream(reportBytes))
                    report = XtraReport.FromStream(ms);
            }

            if (report != null)
            {
                report.ExportOptions.Pdf.PasswordSecurityOptions.PermissionsOptions.ChangingPermissions = DevExpress.XtraPrinting.ChangingPermissions.None;
                report.ExportOptions.Pdf.PasswordSecurityOptions.PermissionsPassword = "Admin";
                report.ExportOptions.Pdf.PasswordSecurityOptions.OpenPassword = "Admin";

                report.ExportToPdf(stream);
                //using (var streams = new FileStream(filePath, FileMode.Create))
                //{
                //     stream.CopyToAsync(streams);
                //}
                stream.Position = 0;

                using (FileStream file = new FileStream(filePath, FileMode.Create, System.IO.FileAccess.Write))
                    stream.CopyTo(file);

                System.Net.Mime.ContentType ct = new System.Net.Mime.ContentType(System.Net.Mime.MediaTypeNames.Application.Pdf);
                Attachment attachment1 = new Attachment(stream, reportName + ".pdf");
                mail.Attachments.Add(attachment1);
                list.Add(stream);
            }

            mail.From = new MailAddress("maniyasagar20@gmail.com");
            mail.To.Add(new MailAddress("maniyasagar20@gmail.com"));
            mail.IsBodyHtml = true;
            Send(mail);
            foreach (MemoryStream mem in list)
            {
                mem.Close();
                mem.Flush();
            }
            {
                return StatusCode(404);
            }
        }

        //get /api/documents/GetById/5
        [HttpGet("GetById/{Id}", Name = "GetDocumenturi")]
        public ActionResult GetDocumentUri(int id)
        {
            var doc = _document.GetById(id);
            if (doc != null)
            {
                return Ok(doc);
            }
            else
            {
                return StatusCode(404);
            }
        }


        //DELETE api/documents/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteDocument(int id)
        {
            var doc = _document.GetById(id);
            if (doc == null)
            {
                return NotFound();
            }

            var uploads = Path.Combine(_host.WebRootPath, "uploads");
            var filePath = Path.Combine(uploads, doc.FileName);
            if (!System.IO.File.Exists(filePath))
                return NotFound();
            else
            {
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _document.Delete(id);
            return Ok(new { message = "deleted Key" });
        }

        private string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;
            if (!provider.TryGetContentType(path, out contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }

        private void Send(MailMessage mailMessage)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(_emailConfig.UserName, _emailConfig.Password),
                EnableSsl = true,
            };

            smtpClient.Send(mailMessage);
        }
    }
}
