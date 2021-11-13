export class Password {
   Id: number;
   PolicyName: string;
   Minlength: number;
   Maxlength: number;
   NoOfUppercaseLetters: number;
   NoOfDigits: number;
   NoOfSpecialLetters: number;
   PasswordAgeInterval: number;
   SessionTimeoutInterval: number;
   IsInactive: boolean;
   IsApplied: boolean;
   DateAdded: Date;
   DateUpdated: Date;
   ModifiedBy: string;
}