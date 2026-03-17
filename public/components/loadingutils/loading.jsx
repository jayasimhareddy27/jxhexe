import { Companynameletters } from "../../../src/globalvar/companydetails";

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loader shadow-modal">
        <span className="letter" style={{ animationDelay: '0s' }}>{Companynameletters[0]}</span>
        <span className="letter" style={{ animationDelay: '0.2s' }}>{Companynameletters[1]}</span>
        <span className="letter" style={{ animationDelay: '0.4s' }}>{Companynameletters[2]}</span>
      </div>
    </div>
  );
}